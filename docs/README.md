# API Documentation

## Utilities

The `src/utils` folder contains all the until functions. You can check the code for details, and feel free to modify it as needed.

### `removeTrailingSlash`

Removes the trailing slash from a given string if it exists and the string length is greater than 1.

#### Parameters

- `input: string`

  - The input string from which the trailing slash should be removed.

#### Returns

- `string`

  - The input string without the trailing slash if it originally had one and its length was greater than 1. Otherwise, returns the input string unchanged.

#### Example Usage

```typescript
import { removeTrailingSlash } from "@/utils/removeTrailingSlash.js";

// Example 1: Input string with trailing slash
const urlWithSlash = "https://example.com/";
const result1 = removeTrailingSlash(urlWithSlash);
console.log(result1); // Output: "https://example.com"

// Example 2: Input string without trailing slash
const urlWithoutSlash = "https://example.com";
const result2 = removeTrailingSlash(urlWithoutSlash);
console.log(result2); // Output: "https://example.com"

// Example 3: Input string with only one character
const singleChar = "/";
const result3 = removeTrailingSlash(singleChar);
console.log(result3); // Output: "/"
```

### `renameFileInFolder`

The `renameFileInFolder` function is a utility that renames a file within a specified folder.

#### Parameters

- `folderPath: string`

  - The path to the folder containing the file to be renamed.

- `originalName: string`

  - The current name of the file that needs to be renamed.

- `newName: string`

  - The new name for the file.

#### Example Usage

```typescript
import { renameFileInFolder } from "@/utils/renameFileInFoler.js";

const folderPath = "./myFolder";
const originalName = "oldFileName.txt";
const newName = "newFileName.txt";

renameFileInFolder(folderPath, originalName, newName);
```

In the above example, the file `oldFileName.txt` in the `./myFolder` directory will be renamed to `newFileName.txt`.

### `replaceTextInFile`

This function reads the content of a file, replaces specified text patterns with corresponding replacements, and writes the modified content to a new file.

#### Parameters

- `options: ReplaceTextInFileOptions<TReplacer>`
  - An object containing the following properties:
    - `sourcePath: string`
      - The path to the source file whose content needs to be read and modified.
    - `replacementMapping: Record<TReplacer, string>`
      - A mapping of text patterns to their replacements. Each key in the mapping will be replaced by its corresponding value in the file content.
    - `outputPath: string`
      - The path where the modified content will be written.

#### Returns

- `void`
  - This function does not return any value.

#### Example Usage

```typescript
import { replaceTextInFile } from "@/utils/replaceTextInFile.js";

replaceTextInFile({
  sourcePath: "./input.txt",
  replacementMapping: {
    foo: "bar",
    hello: "world",
  },
  outputPath: "./output.txt",
});
```

This example reads the content of `input.txt`, replaces all occurrences of "foo" with "bar" and "hello" with "world", and writes the modified content to `output.txt`.

### `getProjectInformation`

Retrieves project information based on the provided project name input. This function processes the input to determine the project's name and path, taking into account various scenarios such as scoped packages and execution within the current directory.

#### Parameters

- `projectNameInput: string`
  - The input string representing the project name or path. It can include trailing slashes or be a relative path like `.`.

#### Returns

- `projectInformation: object`
  - An object including user-created project information that you might need for some features:
    - `name: string`
      - The determined name of the project. If the input is a scoped package, it includes the scope.
    - `path: string`
      - The absolute path to the project directory, resolved from the directory where the user runs your CLI tool.
    - `isCreatedInCliExecutionFolder: boolean`
      - A flag indicating whether the project was created in the CLI execution folder (e.g., using `.` as the project name).

#### Example Usage

```typescript
import { getProjectInformation } from "@/utils/getProjectInformation";

// Assume that the user runs the CLI tool from ~/Document
const projectInfo = getProjectInformation("my-project");
console.log(projectInfo);
// {
//   name: "my-project",
//   path: "~/Document/my-project",
//   isCreatedInCliExecutionFolder: false
// }

// Assume that the user runs the CLI tool from ~/Document
const scopedProjectInfo = getProjectInformation("@scope/my-project");
console.log(scopedProjectInfo);
// {
//   name: "@scope/my-project",
//   path: "~/Document/scope/my-project",
//   isCreatedInCliExecutionFolder: false
// }

// Assume that the user runs the CLI tool from ~/Document/myApp
const cliExecutionProjectInfo = getProjectInformation(".");
console.log(cliExecutionProjectInfo);
// {
//   name: "myApp",
//   path: "~/Document/myApp",
//   isCreatedInCliExecutionFolder: true
// }
```

### `updateProjectPackageJson`

Writes the provided package JSON content to the specified path, formatting it with 2 spaces for readability.

#### Parameters

- `packageJsonPath: string`

  - The file path where the package JSON should be written.

- `packageJsonContent: PackageJson`
  - The content of the package JSON to be written. This should conform to the `PackageJson` type from [`type-fest`](https://github.com/sindresorhus/type-fest).

#### Returns

- `void`
  - This function does not return a value.

#### Example Usage

```typescript
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

import { updateProjectPackageJson } from "@/utils/updateProjectPackageJson";

const packageJsonPath = "./path/to/package.json";
const packageJsonContent: PackageJson = {
  name: "example-package",
  version: "1.0.0",
  scripts: {
    start: "node index.js",
  },
};

updateProjectPackageJson(packageJsonPath, packageJsonContent);
```

### `getPackageManager`

Determines the package manager being used based on the `npm_config_user_agent` environment variable.

#### Parameters

- None

#### Returns

- `PackageManager`
  - A string representing the package manager. Possible values are `"npm"`, `"pnpm"`, `"yarn"`, or `"bun"`. Defaults to `"npm"` if the user agent is not set or recognized.
