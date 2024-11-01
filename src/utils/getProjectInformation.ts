import path from "node:path";

import { removeTrailingSlash } from "@/utils/removeTrailingSlash.js";

export type ProjectInformation = ReturnType<typeof getProjectInformation>;

export const getProjectInformation = (projectNameInput: string) => {
  const input = removeTrailingSlash(projectNameInput);

  const paths = input.split("/");

  let projectName = paths.at(-1)!;

  const isCreatedInCliExecutionFolder = projectName === ".";

  // If the user ran `npx create-temp-gen .` or similar, the projectName should be the current directory
  if (isCreatedInCliExecutionFolder) {
    /**
     * process.cwd() returns different format path string on different OS,
     * so we need to use path.resolve() to parse it.
     */
    const parsedCwd = path.resolve(process.cwd());
    projectName = path.basename(parsedCwd);
  }

  // If the name start with @, it is a scoped package
  const delimiterIndex = paths.findIndex((p) => p.startsWith("@"));
  if (delimiterIndex !== -1) {
    projectName = paths.slice(delimiterIndex).join("/");
  }

  const projectPath = paths.filter((p) => !p.startsWith("@")).join("/");

  return {
    name: projectName,
    path: path.join(process.cwd(), projectPath),
    isCreatedInCliExecutionFolder,
  };
};
