#!/usr/bin/env node
import { program } from "commander";
import { confirm, intro, outro, select, isCancel, note } from "@clack/prompts";
import { execa } from "execa";
import chalk from "chalk";
import path from "node:path";
import fs from "node:fs";
import { detectFramework } from "./lib/detect";
import {
  getPackageManager,
  frameworkToPackage,
  installArgs,
} from "./lib/utils";
import {
  generateConfig,
  getConfigFileName,
  manualInstructions,
} from "./lib/configure";
import { name, version } from "../package.json";
import { CONST_PM_CHOICES } from "./lib/constant";
import { createHeader, ensureHeader } from "./lib/header";
import { mergeNextConfigAST, mergeViteConfigAST } from "./lib/merge-ast";

type PM = (typeof CONST_PM_CHOICES)[number];

async function askConfirmation(
  message: string,
  initial: boolean,
  yes: boolean,
): Promise<boolean> {
  if (yes) return true;
  try {
    const result = await confirm({
      message,
      initialValue: initial,
      withGuide: true,
    });
    if (isCancel(result)) return false;
    return result === true;
  } catch {
    return false; // cancelled
  }
}

async function askPmSelection(
  detectedPm: string,
  yes: boolean,
): Promise<PM | null> {
  if (yes) return (detectedPm as PM) || "npm";
  try {
    const result = await select({
      message: "Which package manager do you want to use?",
      options: CONST_PM_CHOICES.map((pm) => ({
        value: pm,
        label: pm,
        hint: pm === detectedPm ? "detected" : undefined,
      })),
      initialValue: CONST_PM_CHOICES.includes(detectedPm as any)
        ? (detectedPm as PM)
        : "npm",
    });
    if (isCancel(result)) return null;
    return result as PM;
  } catch {
    return null;
  }
}

program
  .name(name)
  .description("Set up typed asset paths for your frontend project")
  .version(version, "-v, --version", "Show version number")
  .option("-d, --dir <path>", "Target project directory", process.cwd())
  .option("-y, --yes", "Use defaults for all prompts", false);

async function setupAction(cwd: string, yes: boolean) {
  intro("Welcome to Typest CLI");

  // ----- Framework detection -----
  const framework = detectFramework(cwd);
  if (!framework) {
    outro(
      chalk.red(
        "No Vite or Next.js project detected. Supported: Vite, Next.js.",
      ),
    );
    process.exit(1);
  }

  const confirmed = await askConfirmation(
    `Detected ${chalk.bold(chalk.cyan(framework))} project. Continue?`,
    true,
    yes,
  );
  if (!confirmed) {
    outro(chalk.red("Operation cancelled."));
    process.exit(0);
  }

  // ----- Package manager -----
  const detectedPm = await getPackageManager(cwd);
  const pm = await askPmSelection(detectedPm, yes);
  if (pm === null) {
    outro(chalk.red("Operation cancelled."));
    process.exit(0);
  }

  const pkg = frameworkToPackage(framework);
  if (!pkg) {
    outro(chalk.red(`No Typest package for framework "${framework}".`));
    process.exit(1);
  }

  // ----- Config (auto or manual) -----
  const configFile = getConfigFileName(framework);
  const auto = await askConfirmation(
    `Automatically update ${chalk.bold(chalk.cyan(configFile))}? (safe merge, no overwrites)`,
    true,
    yes,
  );
  let configUpdated = false,
    configCreated = false;
  let manualText: string | null = null; // store manual instructions for later

  if (!auto) {
    manualText = manualInstructions(framework, configFile); // saved, not printed yet
  } else {
    const filePath = path.join(cwd, configFile);
    const header = createHeader({ framework, version });

    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, "utf-8");
      let merged = existing;
      if (framework === "vite") merged = mergeViteConfigAST(existing);
      else if (framework === "next") merged = mergeNextConfigAST(existing);
      merged = ensureHeader(merged, header);
      fs.writeFileSync(filePath, merged);
      configUpdated = true;
    } else {
      const content = generateConfig(framework, version);
      fs.writeFileSync(filePath, content);
      configCreated = true;
    }
  }

  // ----- Installation -----
  const install = await askConfirmation(
    `Install ${chalk.cyan(pkg)} using ${chalk.cyan(pm)}?`,
    true,
    yes,
  );
  if (install) {
    const [cmd, args] = installArgs(pm, pkg);
    console.log(chalk.blue(`Installing ${pkg} with ${pm}…`));
    await execa(cmd, args, { cwd, stdio: "inherit" });
    console.log(chalk.green(`${pkg} installed.`));
  } else {
    console.log(chalk.yellow("Installation skipped."));
  }

  if (manualText) {
    note(chalk.white(manualText));
  }

  // ----- Final status -----
  const statusParts: string[] = [];
  if (configUpdated) statusParts.push("config updated");
  if (configCreated) statusParts.push("config created");
  if (install) statusParts.push(`${chalk.cyan(pkg)} installed`);
  const statusText =
    statusParts.length > 0 ? statusParts.join(" · ") : "Setup complete";

  outro(
    `✅ ${statusText}` +
      chalk.gray(" (Start your dev server to generate the type declarations.)"),
  );
}

program
  .command("config")
  .description("Detect framework, install the plugin, and configure it")
  .action(async () => {
    const opts = program.opts();
    const cwd = path.resolve(opts.dir);
    await setupAction(cwd, opts.yes);
  });

program.parse();
