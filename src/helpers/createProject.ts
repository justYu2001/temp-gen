import path from "node:path";

import chalk from "chalk";

import { scaffoldProject } from "@/helpers/scaffoldProject.js";
import { getProjectInformation } from "@/utils/getProjectInformation.js";
import { logger } from "@/utils/logger.js";
import { renameFileInFolder } from "@/utils/renameFileInFolder.js";
import { replaceTextInFile } from "@/utils/replaceTextInFile.js";

const FILES_INCLUDING_PROJECT_NAME = [
  "src/constants.ts",
  "src/index.ts",
  "src/utils/getProjectInformation.ts",
];

export const createProject = async (projectNameInput: string) => {
  const project = getProjectInformation(projectNameInput);
  await scaffoldProject(project);
  renameFileInFolder(project.path, "_prettierrc.mjs", ".prettierrc.mjs");
  renameFileInFolder(project.path, "_eslintrc.cjs", ".eslintrc.cjs");
  renameFileInFolder(project.path, "_eslintignore", ".eslintignore");

  FILES_INCLUDING_PROJECT_NAME.forEach((file) => {
    const filePath = path.join(project.path, file);

    replaceTextInFile({
      sourcePath: filePath,
      replacementMapping: {
        "temp-gen": project.name,
      },
      outputPath: filePath,
    });
  });

  const projectNameToShow = project.isCreatedInCliExecutionFolder
    ? "App"
    : chalk.cyan.bold(project.name);

  logger.success(`${projectNameToShow} created successfully!\n`);

  return project;
};
