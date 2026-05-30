import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = new URL("..", import.meta.url).pathname;
const sourceRoot = path.join(root, "src", "cljs");

const disallowedTokens = [
  "js/",
  "js->clj",
  "clj->js",
  "#js",
  "aget",
  "aset",
  "js/Promise",
  "js/JSON",
  "js/Array.from",
  "js/Buffer",
  "js/process",
  "js/window",
  "js/document",
];

function isAllowedInteropFile(filePath) {
  const normalized = filePath.split(path.sep).join("/");
  return normalized.includes("/extern/") || normalized.endsWith("/facade.cljs");
}

function hasForbiddenUtilsSegment(filePath) {
  const normalized = filePath.split(path.sep).join("/");
  return normalized.includes("/utils/") || normalized.endsWith("/utils.cljs");
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".cljs")) {
      files.push(entryPath);
    }
  }
  return files;
}

const violations = [];
const files = await walk(sourceRoot);

for (const file of files) {
  const relative = path.relative(root, file);

  if (isAllowedInteropFile(file)) {
    continue;
  }

  if (hasForbiddenUtilsSegment(file)) {
    violations.push(`${relative}: forbidden utils namespace/path segment`);
  }

  const text = await readFile(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const token of disallowedTokens) {
      if (line.includes(token)) {
        violations.push(`${relative}:${index + 1}: raw interop token outside extern/facade: ${token}`);
      }
    }
  });
}

if (violations.length > 0) {
  console.error(violations.map((violation) => `boundary violation: ${violation}`).join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, checked: files.length }));
