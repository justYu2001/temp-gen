import path from "node:path";

import * as p from "@clack/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";

import { PACKAGE_ROOT } from "@/constants.js";
import { type ProjectInformation } from "@/utils/getProjectInformation.js";
import { renameFileInFolder } from "@/utils/renameFileInFolder.js";

export const scaffoldProject = async (project: ProjectInformation) => {
  const sourcePath = path.join(PACKAGE_ROOT, "template");

  const spinner = ora(`Scaffolding in: ${project.path}...\n`).start();

  if (fs.existsSync(project.path)) {
    if (fs.readdirSync(project.path).length === 0) {
      if (project.name !== ".") {
        spinner.info(`${chalk.cyan.bold(project.name)} exists but is empty, continuing...\n`);
      }
    } else {
      spinner.stopAndPersist();

      const action = await p.select({
        message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(project.name)} already exists and isn't empty. How would you like to proceed?`,
        options: [
          {
            label: "Abort installation (recommended)",
            value: "abort",
          },
          {
            label: "Clear the directory and continue creating the project",
            value: "clear",
          },
          {
            label: "Continue creating the project and overwrite conflicting files",
            value: "overwrite",
          },
        ],
        initialValue: "abort",
      });

      if (action === "abort") {
        spinner.fail("Abort installation...");
        process.exit(1);
      }

      const overwriteAction =
        action === "overwrite" ? "overwrite conflicting files" : "clear the directory";

      const isOverwriteConfirmed = await p.confirm({
        message: `Are you sure you want to ${overwriteAction}?`,
        initialValue: false,
      });

      if (!isOverwriteConfirmed) {
        spinner.fail("Abort installation...");
        process.exit(1);
      }

      if (action === "clear") {
        spinner.info(`Emptying ${chalk.cyan.bold(project.name)} and creating project...\n`);
        fs.emptyDirSync(project.path);
      }
    }
  }

  spinner.start();

  fs.copySync(sourcePath, project.path);

  renameFileInFolder(project.path, "_gitignore", ".gitignore");

  spinner.stop();
};
