# API Documentation

## Utilities

The `src/utils` folder contains all the until functions. You can check the code for details, and feel free to modify it as needed.

### `removeTrailingSlash`

Removes the trailing slash from a given string if it exists and the string length is greater than 1.

#### **Parameters**

- `input: string`

  The input string from which the trailing slash should be removed.

#### **Returns**

- `string`

  The input string without the trailing slash if it originally had one and its length was greater than 1. Otherwise, returns the input string unchanged.

#### **Example Usage**

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

  The path to the folder containing the file to be renamed.

- `originalName: string`

  The current name of the file that needs to be renamed.

- `newName: string`

  The new name for the file.

#### Example Usage

```typescript
import { renameFileInFolder } from "./path/to/your/module";

const folderPath = "./myFolder";
const originalName = "oldFileName.txt";
const newName = "newFileName.txt";

renameFileInFolder(folderPath, originalName, newName);
```

In the above example, the file `oldFileName.txt` in the `./myFolder` directory will be renamed to `newFileName.txt`.
