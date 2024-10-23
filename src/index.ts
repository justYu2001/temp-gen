#!/user/bin/env node
import path from "node:path";

import * as p from "@clack/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

import { runCli } from "@/cli/index.js";
import { createProject } from "@/utils/createProject.js";
import { updateProjectPackageJson } from "@/utils/updateProjectPackageJson.js";

const main = async () => {
  console.clear();

  p.intro(chalk.bgCyan.black("  create-temp-gen  "));

  const { projectName } = await runCli();

  const project = createProject(projectName);

  const packageJsonPath = path.join(project.path, "package.json");
  const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;
  packageJson.name = project.name;
  updateProjectPackageJson(packageJsonPath, packageJson);

  process.exit(0);
};

void main();
