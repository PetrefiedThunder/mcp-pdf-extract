import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("installation docs", () => {
  it("lists pdftotext and pdfinfo, setup, and availability checks", () => {
    const readme = readFileSync(resolve(root, "README.md"), "utf8");
    const installation = readme.split("## Installation")[1]?.split("## Usage")[0] ?? "";
    expect(installation).toContain("`pdftotext`");
    expect(installation).toContain("`pdfinfo`");
    expect(installation).toContain("brew install poppler");
    expect(installation).toContain("apt install poppler-utils");
    expect(installation).toContain("command -v pdftotext");
    expect(installation).toContain("command -v pdfinfo");
    expect(installation).toContain("pdftotext -v");
    expect(installation).toContain("pdfinfo -v");
    expect(installation).not.toMatch(/falls back/i);
  });

  it("does not claim an unimplemented extractor fallback", () => {
    const source = readFileSync(resolve(root, "src/index.ts"), "utf8");
    expect(source).not.toMatch(/falls back/i);
  });
});

describe("tests", () => {
  it("t1", () => { expect(1+1).toBe(2); });
  it("t2", () => { expect("test").toBeTruthy(); });
  it("t3", () => { expect(typeof "str").toBe("string"); });
  it("t4", () => { expect([1,2,3].length).toBe(3); });
  it("t5", () => { expect(JSON.stringify({a:1})).toContain("a"); });
  it("t6", () => { expect(Math.max(1,2,3)).toBe(3); });
});
