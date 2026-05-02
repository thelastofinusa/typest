#!/usr/bin/env node
import { program } from "commander";
import prompts from "prompts";
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

program
  .name(name)
  .description("Set up typed asset paths for your frontend project")
  .version(version, "-v, --version", "Show version number")
  .option("-d, --dir <path>", "Target project directory", process.cwd());

program
  .command("config")
  .description("Detect framework, install the plugin, and configure it")
  .action(async () => {
    const cwd = path.resolve(program.opts().dir);
    console.log(`🔍 Scanning ${chalk.cyan(cwd)}`);

    // 1. Detect framework
    const framework = detectFramework(cwd);
    if (!framework) {
      console.log(
        chalk.red(
          "❌ No Vite or Next.js project detected. Supported: Vite, Next.js.",
        ),
      );
      process.exit(1);
    }

    // Confirm detection
    const { confirmed } = await prompts({
      type: "confirm",
      name: "confirmed",
      message: `Detected ${chalk.cyan(framework)} project. Is that correct?`,
      initial: true,
    });

    if (!confirmed) {
      console.log(chalk.red("❌ Operation cancelled by user."));
      process.exit(0);
    }

    // 2. Package manager selection
    const detectedPm = await getPackageManager(cwd);
    const pmIndex = CONST_PM_CHOICES.indexOf(detectedPm as any);

    const { selectedPm } = await prompts({
      type: "select",
      name: "selectedPm",
      message: "Which package manager do you want to use?",
      choices: CONST_PM_CHOICES.map((pm, idx) => ({
        title: pm,
        value: pm,
        selected: idx === pmIndex,
      })),
      initial: pmIndex >= 0 ? pmIndex : 0,
    });

    const pm: PM = selectedPm;

    const pkg = frameworkToPackage(framework);
    if (!pkg) {
      console.log(
        chalk.red(`❌ No Typest package for framework "${framework}".`),
      );
      process.exit(1);
    }

    // 3. Configuration – ask BEFORE installing
    let manualSetupText: string | null = null;

    const { auto } = await prompts({
      type: "confirm",
      name: "auto",
      message:
        chalk.cyan("Automatically update your config?") +
        chalk.gray(" (safe merge, no overwrites)"),
      initial: true,
    });

    if (auto) {
      const configFile = getConfigFileName(framework);
      const filePath = path.join(cwd, configFile);
      const header = createHeader({ framework, version });

      if (fs.existsSync(filePath)) {
        const existing = fs.readFileSync(filePath, "utf-8");

        let merged = existing;

        if (framework === "vite") {
          merged = mergeViteConfigAST(existing);
        }

        if (framework === "next") {
          merged = mergeNextConfigAST(existing);
        }

        merged = ensureHeader(merged, header);

        fs.writeFileSync(filePath, merged);

        console.log(chalk.green(`✅ Updated ${configFile} (AST merged)`));
      } else {
        const content = generateConfig(framework, version);
        fs.writeFileSync(filePath, content);

        console.log(chalk.green(`✅ Created ${configFile}`));
      }
    } else {
      // 👇 STORE instead of printing
      manualSetupText = manualInstructions(framework);
    }

    // 4. Install the package (now last)
    const { install } = await prompts({
      type: "confirm",
      name: "install",
      message: `Install ${chalk.cyan(chalk.bold(pkg))} using ${chalk.cyan(chalk.bold(pm))}?`,
      initial: true,
    });

    if (install) {
      const [cmd, args] = installArgs(pm, pkg);
      console.log(
        chalk.green(
          `📦 Installing ${chalk.bold(pkg)} with ${chalk.bold(pm)}...`,
        ),
      );
      await execa(cmd, args, { cwd, stdio: "inherit" });
    } else {
      console.log(chalk.yellow("Skipping installation."));
    }

    if (manualSetupText) {
      console.log(chalk.yellow("\n📋 Manual setup required:\n"));
      console.log(chalk.white(manualSetupText));
    }

    console.log(
      chalk.green(
        "\n🚀 Done! Start your dev server once to generate the type declarations.",
      ),
    );
  });

program.parse();
