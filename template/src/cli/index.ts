import * as p from "@clack/prompts";
import { Command } from "commander";

import { validateProjectName } from "@/cli/validateProjectName.js";
import { CLI_TOOL_NAME, DEFAULT_PROJECT_NAME } from "@/constants.js";

import { validateImportAlias } from "./validateImportAlias.js";

interface CliResult {
  projectName: string;
  flags: {
    importAlias: string;
  };
}

const DEFAULT_CLI_RESULT: CliResult = {
  projectName: DEFAULT_PROJECT_NAME,
  flags: {
    importAlias: "@/",
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
      "-i, --import-alias <alias>",
      "Explicitly tell the CLI to use a custom import alias",
      DEFAULT_CLI_RESULT.flags.importAlias,
    )
    .parse();

  const projectNameFromCommand = command.args[0];

  const flagsFromCommand = command.opts<CliResult["flags"]>();

  const interactiveCliResult = await p.group({
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
    // Ask any questions you want here
  });

  return {
    projectName: projectNameFromCommand ?? interactiveCliResult.projectName!,
    flags: {
      importAlias: interactiveCliResult.importAlias,
    },
  };
};
