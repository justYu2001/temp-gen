import fs from "fs-extra";
import { type PackageJson } from "type-fest";

export const updateProjectPackageJson = (
  packageJsonPath: string,
  packageJsonContent: PackageJson,
) => {
  fs.writeJSONSync(packageJsonPath, packageJsonContent, {
    spaces: 2,
  });
};
