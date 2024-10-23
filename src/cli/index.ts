import * as p from "@clack/prompts";

import { validateProjectName } from "@/cli/validateProjectName.js";
import { DEFAULT_PROJECT_NAME } from "@/constants.js";

export const runCli = () => {
  return p.group({
    projectName: () => {
      return p.text({
        message: "What will your project be called?",
        validate: validateProjectName,
        defaultValue: DEFAULT_PROJECT_NAME,
      });
    },
  });
};
