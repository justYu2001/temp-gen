import * as p from "@clack/prompts";
import { Command } from "commander";

import { validateProjectName } from "@/cli/validateProjectName.js";
import { CLI_TOOL_NAME, DEFAULT_IMPORT_ALIAS, DEFAULT_PROJECT_NAME } from "@/constants.js";
import { getPackageManager } from "@/utils/getPackageManager.js";

import { validateImportAlias } from "./validateImportAlias.js";

interface CliResult {
  projectName: string;
  flags: {
    importAlias: string;
    noInstall: boolean;
    noGit: boolean;
  };
}

const DEFAULT_CLI_RESULT: CliResult = {
  projectName: DEFAULT_PROJECT_NAME,
  flags: {
    importAlias: DEFAULT_IMPORT_ALIAS,
    noInstall: false,
    noGit: false,
  },
};

export const runCli = async () => {
  const command = new Command()
    .name(CLI_TOOL_NAME)
    .description("A CLI for creating JS/TS project template generator.")
    .argument(
      "[directory]",
      "The name of the generator, as well as the name of the directory to create",
    )
    .option(
      "--noInstall",
      "Explicitly tell the CLI to not run the package manager's install command",
      DEFAULT_CLI_RESULT.flags.noInstall,
    )
    .option(
      "--noGit",
      "Explicitly tell the CLI to not initialize a new git repo in the project",
      false,
    )
    .option(
      "-i, --import-alias <alias>",
      "Explicitly tell the CLI to use a custom import alias",
      DEFAULT_CLI_RESULT.flags.importAlias,
    )
    .parse();

  const projectNameFromCommand = command.args[0];

  const flagsFromCommand = command.opts<CliResult["flags"]>();

  const packageManager = getPackageManager();

  const interactiveCliResult = await p.group(
    {
      ...(!projectNameFromCommand && {
        projectName: () => {
          return p.text({
            message: "What will your project be called?",
            defaultValue: DEFAULT_PROJECT_NAME,
            validate: validateProjectName,
          });
        },
      }),
      importAlias: () => {
        return p.text({
          message: "What import alias would you like to use?",
          defaultValue: flagsFromCommand.importAlias,
          placeholder: flagsFromCommand.importAlias,
          validate: validateImportAlias,
        });
      },
      ...(!flagsFromCommand.noInstall && {
        install: () => {
          return p.confirm({
            message:
              `Should we run '${packageManager}` +
              (packageManager === "yarn" ? `'?` : ` install' for you?`),
            initialValue: !DEFAULT_CLI_RESULT.flags.noInstall,
          });
        },
      }),
      ...(!flagsFromCommand.noGit && {
        git: () => {
          return p.confirm({
            message: "Should we initialize a Git repository and stage the changes?",
            initialValue: !DEFAULT_CLI_RESULT.flags.noGit,
          });
        },
      }),
      // Ask any question you want to ask
    },
    {
      onCancel() {
        process.exit(1);
      },
    },
  );

  return {
    projectName: projectNameFromCommand ?? interactiveCliResult.projectName!,
    flags: {
      importAlias: interactiveCliResult.importAlias,
      noInstall: !interactiveCliResult.install || flagsFromCommand.noInstall,
      noGit: !interactiveCliResult.git || flagsFromCommand.noGit,
    },
  };
};
