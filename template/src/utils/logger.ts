import chalk from "chalk";

export const logger = {
  success(...args: unknown[]) {
    console.log(chalk.green(...args));
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args));
  },
};
