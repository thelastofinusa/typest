import ora from "ora";
import chalk from "chalk";

export function startSpinner(text: string) {
  return ora({ text: chalk.blue(text), spinner: "dots" }).start();
}
