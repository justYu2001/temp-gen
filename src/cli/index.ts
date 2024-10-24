import * as p from "@clack/prompts";
import { Command } from "commander";

import { validateProjectName } from "@/cli/validateProjectName.js";
import { CLI_TOOL_NAME, DEFAULT_PROJECT_NAME } from "@/constants.js";

export const runCli = () => {
  const command = new Command()
    .name(CLI_TOOL_NAME)
    .description("A CLI for creating JS/TS project template generator.")
    .argument(
      "[directory]",
      "The name of the generator, as well as the name of the directory to create",
    )
    .parse();

  const projectNameFromCommand = command.args[0];
  if (projectNameFromCommand) {
    return {
      projectName: projectNameFromCommand,
    };
  }

  return p.group({
    projectName: () => {
      return p.text({
        message: "What will your project be called?",
        defaultValue: DEFAULT_PROJECT_NAME,
        validate: validateProjectName,
      });
    },
  });
};
