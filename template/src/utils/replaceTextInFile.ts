import fs from "node:fs";

interface ReplaceTextInFileOptions<TReplacer extends string> {
  sourcePath: string;
  replacementMapping: Record<TReplacer, string>;
  outputPath: string;
}

export const replaceTextInFile = <TReplacer extends string>({
  sourcePath,
  replacementMapping,
  outputPath,
}: ReplaceTextInFileOptions<TReplacer>) => {
  let fileContent = fs.readFileSync(sourcePath, "utf-8");

  Object.entries<string>(replacementMapping).forEach(([key, value]) => {
    fileContent = fileContent.replace(new RegExp(key, "g"), value);
  });

  fs.writeFileSync(outputPath, fileContent);
};
