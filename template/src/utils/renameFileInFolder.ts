import fs from "node:fs";
import path from "node:path";

export const renameFileInFolder = (folderPath: string, originalName: string, newName: string) => {
  fs.renameSync(path.join(folderPath, originalName), path.join(folderPath, newName));
};
