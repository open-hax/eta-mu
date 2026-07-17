import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { findConfigPath, loadConfig } from "../src/config.js";

const withTempDir = async (fn: (dir: string) => Promise<void>): Promise<void> => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "openhax-kanban-config-"));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

describe("findConfigPath", () => {
  it("discovers config in the current working directory", async () => {
    await withTempDir(async (dir) => {
      const configPath = path.join(dir, "openhax.kanban.json");
      await writeFile(configPath, "{}", "utf8");

      const originalCwd = process.cwd();
      try {
        process.chdir(dir);
        const found = await findConfigPath();
        expect(found).toBe(configPath);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  it("discovers config in a ./kanban/ subdirectory", async () => {
    await withTempDir(async (dir) => {
      const kanbanDir = path.join(dir, "kanban");
      await mkdir(kanbanDir, { recursive: true });
      const configPath = path.join(kanbanDir, "openhax.kanban.json");
      await writeFile(configPath, "{}", "utf8");

      const originalCwd = process.cwd();
      try {
        process.chdir(dir);
        const found = await findConfigPath();
        expect(found).toBe(configPath);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  it("discovers config in a ./.kanban/ subdirectory", async () => {
    await withTempDir(async (dir) => {
      const kanbanDir = path.join(dir, ".kanban");
      await mkdir(kanbanDir, { recursive: true });
      const configPath = path.join(kanbanDir, "openhax.kanban.json");
      await writeFile(configPath, "{}", "utf8");

      const originalCwd = process.cwd();
      try {
        process.chdir(dir);
        const found = await findConfigPath();
        expect(found).toBe(configPath);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  it("prefers the current working directory over subdirectories", async () => {
    await withTempDir(async (dir) => {
      const rootConfig = path.join(dir, "openhax.kanban.json");
      const subConfig = path.join(dir, "kanban", "openhax.kanban.json");
      await mkdir(path.dirname(subConfig), { recursive: true });
      await writeFile(rootConfig, "{}", "utf8");
      await writeFile(subConfig, "{}", "utf8");

      const originalCwd = process.cwd();
      try {
        process.chdir(dir);
        const found = await findConfigPath();
        expect(found).toBe(rootConfig);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  it("returns undefined when no config is found", async () => {
    await withTempDir(async (dir) => {
      const originalCwd = process.cwd();
      try {
        process.chdir(dir);
        const found = await findConfigPath();
        expect(found).toBeUndefined();
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

describe("loadConfig", () => {
  it("resolves tasksDir relative to the discovered config directory", async () => {
    await withTempDir(async (dir) => {
      const kanbanDir = path.join(dir, "kanban");
      await mkdir(kanbanDir, { recursive: true });
      const configPath = path.join(kanbanDir, "openhax.kanban.json");
      await writeFile(
        configPath,
        JSON.stringify({ tasksDir: "./tasks" }),
        "utf8",
      );
      await mkdir(path.join(kanbanDir, "tasks"), { recursive: true });

      const originalCwd = process.cwd();
      try {
        process.chdir(dir);
        const loaded = await loadConfig();
        expect(loaded.configPath).toBe(configPath);
        expect(loaded.configDir).toBe(kanbanDir);
        expect(loaded.config.tasksDir).toBe("./tasks");
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});
