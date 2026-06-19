import { describe, expect, it, vi } from "vitest";

import { publishActionBatch } from "../src/runtime-batch.ts";

describe("publishActionBatch", () => {
  it("aborts the request when the timeout is reached", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new Error("aborted"));
        });
      }),
    );

    await expect(
      publishActionBatch("http://localhost:9999", { kind: "test" }, 1),
    ).rejects.toThrow("aborted");
  });

  it("clears the timeout when the response arrives quickly", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, status: 204 });

    await expect(
      publishActionBatch("http://localhost:9999", { kind: "test" }, 30_000),
    ).resolves.toBeUndefined();
  });
});
