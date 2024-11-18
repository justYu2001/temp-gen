import fs from "node:fs";
import path from "node:path";

import { DEFAULT_IMPORT_ALIAS } from "@/constants.js";
import { replaceTextInFile } from "@/utils/replaceTextInFile.js";

const replaceImportAliasInProject = (folderPath: string, replacement: string) => {
  const entries = fs.readdirSync(folderPath);

  entries.forEach((entry) => {
    const entryPath = path.join(folderPath, entry);

    if (fs.statSync(entryPath).isDirectory()) {
      replaceImportAliasInProject(entryPath, replacement);
    } else {
      replaceTextInFile({
        sourcePath: entryPath,
        replacementMapping: {
          [DEFAULT_IMPORT_ALIAS]: replacement,
        },
        outputPath: entryPath,
      });
    }
  });
};

export const setImportAlias = (projectPath: string, importAlias: string) => {
  const normalizedImportAlias = importAlias
    .replace(/\*/g, "") // remove any wildcards (~/* -> ~/)
    .replace(/[^/]$/, "$&/"); // ensure trailing slash (@ -> @/)

  replaceImportAliasInProject(projectPath, normalizedImportAlias);
};
