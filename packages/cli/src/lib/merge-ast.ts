import { Project, SyntaxKind } from "ts-morph";

const VITE_PLUGIN = "typedAssets";
const NEXT_WRAPPER = "withTypedAssets";

export function mergeViteConfigAST(sourceText: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const file = project.createSourceFile("vite.config.ts", sourceText, {
    overwrite: true,
  });

  // 1. Ensure import exists
  const hasImport = file
    .getImportDeclarations()
    .some((d) => d.getModuleSpecifierValue() === "@typest/vite/plugin");

  if (!hasImport) {
    file.addImportDeclaration({
      namedImports: [VITE_PLUGIN],
      moduleSpecifier: "@typest/vite/plugin",
    });
  }

  // 2. Find defineConfig call
  const defineConfigCall = file
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((call) => call.getExpression().getText() === "defineConfig");

  if (!defineConfigCall) return file.getFullText();

  const arg = defineConfigCall.getArguments()[0];
  if (!arg || !arg.asKind(SyntaxKind.ObjectLiteralExpression)) {
    return file.getFullText();
  }

  const obj = arg.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  // 3. Find or create plugins array
  let pluginsProp = obj.getProperty("plugins");

  if (!pluginsProp) {
    obj.addPropertyAssignment({
      name: "plugins",
      initializer: "[]",
    });
    pluginsProp = obj.getProperty("plugins");
  }

  const pluginsArray = pluginsProp
    ?.asKind(SyntaxKind.PropertyAssignment)
    ?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);

  if (!pluginsArray) return file.getFullText();

  // 4. Check if already added
  const alreadyExists = pluginsArray
    .getElements()
    .some((el) => el.getText().includes("typedAssets"));

  if (!alreadyExists) {
    pluginsArray.addElement(`typedAssets({ sources: [{ dir: 'public' }] })`);
  }

  return file.getFullText();
}

export function mergeNextConfigAST(sourceText: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const file = project.createSourceFile("next.config.ts", sourceText, {
    overwrite: true,
  });

  // 1. Ensure import
  const hasImport = file
    .getImportDeclarations()
    .some((d) => d.getModuleSpecifierValue() === "@typest/nextjs/plugin");

  if (!hasImport) {
    file.addImportDeclaration({
      namedImports: [NEXT_WRAPPER],
      moduleSpecifier: "@typest/nextjs/plugin",
    });
  }

  // 2. Find default export
  const exportAssignment = file.getExportAssignment((e) => !e.isExportEquals());

  if (!exportAssignment) return file.getFullText();

  const expr = exportAssignment.getExpression();
  if (!expr) return file.getFullText();

  // 3. Avoid double wrapping
  if (expr.getText().includes("withTypedAssets")) {
    return file.getFullText();
  }

  // 4. Wrap it
  exportAssignment.setExpression(
    `withTypedAssets({ sources: [{ dir: 'public' }] })(${expr.getText()})`,
  );

  return file.getFullText();
}
