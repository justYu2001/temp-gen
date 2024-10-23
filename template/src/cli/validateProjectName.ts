import { getProjectInformation } from "@/utils/getProjectInformation.js";

const PROJECT_REG_EXP = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

// Custom your project name validation logic here.
export const validateProjectName = (rawInput: string) => {
  const { name, isCreatedInCliExecutionFolder } = getProjectInformation(rawInput);

  if (isCreatedInCliExecutionFolder || PROJECT_REG_EXP.test(name)) {
    return;
  } else {
    return "Project name must consist of only lowercase alphanumeric characters, '-', and '_'";
  }
};
