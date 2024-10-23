import path from "node:path";
import { fileURLToPath } from "node:url";

const outputFilePath = fileURLToPath(import.meta.url);
const distPath = path.dirname(outputFilePath);
export const PACKAGE_ROOT = path.resolve(distPath, "../");

export const DEFAULT_PROJECT_NAME = "my-temp-gen";