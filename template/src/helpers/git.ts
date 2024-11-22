import { execSync } from "node:child_process";
import path from "node:path";

import * as p from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";

import { type ProjectInformation } from "@/utils/getProjectInformation.js";
import { logger } from "@/utils/logger.js";

const isGitInstalled = (directoryPath: string) => {
  try {
    execSync("git --version", { cwd: directoryPath });
    return true;
  } catch {
    return false;
  }
};

/** @returns Whether or not the provided directory has a `.git` subdirectory in it. */
export const isRootGitRepo = (directoryPath: string) => {
  return fs.existsSync(path.join(directoryPath, ".git"));
};

/** @returns Whether or not this directory or a parent directory has a `.git` directory. */
export const isInsideGitRepo = async (directoryPath: string) => {
  try {
    // If this command succeeds, we're inside a git repo
    await execa("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: directoryPath,
      stdout: "ignore",
    });

    return true;
  } catch {
    // Else, it will throw a git-error and we return false
    return false;
  }
};

const getGitVersion = () => {
  const stdout = execSync("git --version").toString().trim();
  const gitVersionTag = stdout.split(" ")[2];
  const major = gitVersionTag?.split(".")[0];
  const minor = gitVersionTag?.split(".")[1];

  return { major: Number(major), minor: Number(minor) };
};

/** @returns The git config value of "init.defaultBranch". If it is not set, returns "main". */
const getDefaultBranch = () => {
  return execSync("git config --global init.defaultBranch || echo main").toString().trim();
};

export const initializeGit = async (project: ProjectInformation) => {
  logger.info("Initializing Git...");

  if (!isGitInstalled(project.path)) {
    logger.warn("Git is not installed. Skipping Git initialization.");
    return;
  }

  const spinner = ora("Creating a new git repo...\n").start();

  const isRoot = isRootGitRepo(project.path);
  const isInside = await isInsideGitRepo(project.path);

  if (isInside && isRoot) {
    // Directory is a root git repo
    spinner.stop();

    const overwriteGit = await p.confirm({
      message: `${chalk.redBright.bold(
        "Warning:",
      )} Git is already initialized in "${project.name}". Initializing a new git repository would delete the previous history. Would you like to continue anyways?`,
      initialValue: false,
    });

    if (!overwriteGit) {
      spinner.info("Skipping Git initialization.");
      return;
    }

    // Deleting the .git folder
    fs.removeSync(path.join(project.path, ".git"));
  } else if (isInside && !isRoot) {
    // Directory is inside a git worktree
    spinner.stop();

    const initializeChildGitRepo = await p.confirm({
      message: `${chalk.redBright.bold(
        "Warning:",
      )} "${project.path}" is already in a git worktree. Would you still like to initialize a new git repository in this directory?`,
      initialValue: false,
    });

    if (!initializeChildGitRepo) {
      spinner.info("Skipping Git initialization.");
      return;
    }
  }

  // We're good to go, initializing the git repo
  try {
    const branchName = getDefaultBranch();

    // --initial-branch flag was added in git v2.28.0
    const { major, minor } = getGitVersion();

    if (major < 2 || (major == 2 && minor < 28)) {
      await execa("git", ["init"], { cwd: project.path });
      // symbolic-ref is used here due to refs/heads/master not existing
      // It is only created after the first commit
      // https://superuser.com/a/1419674
      await execa("git", ["symbolic-ref", "HEAD", `refs/heads/${branchName}`], {
        cwd: project.path,
      });
    } else {
      await execa("git", ["init", `--initial-branch=${branchName}`], {
        cwd: project.path,
      });
    }

    await execa("git", ["add", "."], { cwd: project.path });

    spinner.succeed(
      `${chalk.green("Successfully initialized and staged")} ${chalk.green.bold("git")}\n`,
    );
  } catch {
    // Safeguard, should be unreachable
    spinner.fail(
      `${chalk.bold.red("Failed:")} could not initialize git. Update git to the latest version!\n`,
    );
  }
};
