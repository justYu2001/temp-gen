import chalk from "chalk";

export const logger = {
  success(...args: unknown[]) {
    console.log(chalk.green(...args));
  },
};
