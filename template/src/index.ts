#!/user/bin/env node
import * as p from "@clack/prompts";
import chalk from "chalk";

import { runCli } from "@/cli/index.js";

const main = async () => {
  console.clear();

  p.intro(chalk.bgCyan.black("  create-temp-gen  "));

  const { projectName } = await runCli();

  // Custom your template generation logic here.

  process.exit(0);
};

void main();
