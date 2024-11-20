import chalk from "chalk";
import { execa, type StdoutStderrOption } from "execa";
import ora, { type Ora } from "ora";

import { getPackageManager, type PackageManager } from "@/utils/getPackageManager.js";
import { logger } from "@/utils/logger.js";

const execWithSpinner = async (
  projectPath: string,
  packageManager: PackageManager,
  options: {
    args?: string[];
    stdout?: StdoutStderrOption;
    onDataHandle?: (spinner: Ora) => (data: Buffer) => void;
  },
) => {
  const { onDataHandle, args = ["install"], stdout = "pipe" } = options;

  const spinner = ora(`Running ${packageManager} install...`).start();
  const subprocess = execa(packageManager, args, { cwd: projectPath, stdout });

  await new Promise<void>((resolve, reject) => {
    if (onDataHandle) {
      subprocess.stdout?.on("data", onDataHandle(spinner));
    }

    void subprocess.on("error", (error) => reject(error));
    void subprocess.on("close", () => resolve());
  });

  return spinner;
};

const runInstallCommand = async (
  packageManager: PackageManager,
  projectPath: string,
): Promise<Ora | null> => {
  switch (packageManager) {
    // When using npm, inherit the stderr stream so that the progress bar is shown
    case "npm":
      await execa(packageManager, ["install"], {
        cwd: projectPath,
        stderr: "inherit",
      });

      return null;
    // When using yarn or pnpm, use the stdout stream and ora spinner to show the progress
    case "pnpm":
      return execWithSpinner(projectPath, packageManager, {
        onDataHandle: (spinner) => (data) => {
          const text = data.toString();

          if (text.includes("Progress")) {
            spinner.text = text.includes("|") ? (text.split(" | ")[1] ?? "") : text;
          }
        },
      });
    case "yarn":
      return execWithSpinner(projectPath, packageManager, {
        onDataHandle: (spinner) => (data) => {
          spinner.text = data.toString();
        },
      });
    // When using bun, the stdout stream is ignored and the spinner is shown
    case "bun":
      return execWithSpinner(projectPath, packageManager, { stdout: "ignore" });
  }
};

export const installDependencies = async ({ projectPath }: { projectPath: string }) => {
  logger.info("Installing dependencies...");
  const pkgManager = getPackageManager();

  const installSpinner = await runInstallCommand(pkgManager, projectPath);

  (installSpinner ?? ora()).succeed(chalk.green("Successfully installed dependencies!\n"));
};
