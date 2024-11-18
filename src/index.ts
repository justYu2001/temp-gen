#!/user/bin/env node
import path from "node:path";

import * as p from "@clack/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

import { runCli } from "@/cli/index.js";
import { createProject } from "@/helpers/createProject.js";
import { setImportAlias } from "@/helpers/setImportAlias.js";
import { updateProjectPackageJson } from "@/utils/updateProjectPackageJson.js";

const main = async () => {
  console.clear();

  p.intro(chalk.bgCyan.black("  create-temp-gen  "));

  const { projectName, flags } = await runCli();

  const project = await createProject(projectName);

  setImportAlias(project.path, flags.importAlias);

  const packageJsonPath = path.join(project.path, "package.json");
  const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;
  packageJson.name = project.name;
  updateProjectPackageJson(packageJsonPath, packageJson);

  process.exit(0);
};

void main();
