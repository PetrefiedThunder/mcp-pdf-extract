#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";

const server = new McpServer({ name: "mcp-pdf-extract", version: "1.0.0" });

// Uses pdftotext (poppler) if available, falls back to basic extraction
function extractWithPoppler(filePath: string, options: string[] = []): string {
  try {
    return execSync(`pdftotext ${options.join(" ")} "${filePath}" -`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  } catch {
    throw new Error("pdftotext not found. Install poppler: brew install poppler (macOS) or apt install poppler-utils (Linux)");
  }
}

server.tool("extract_text", "Extract all text from a PDF file.", {
  filePath: z.string().describe("Path to PDF file"),
  layout: z.boolean().default(false).describe("Maintain original layout (useful for tables)"),
  pageFrom: z.number().optional().describe("First page to extract (1-indexed)"),
  pageTo: z.number().optional().describe("Last page to extract"),
}, async ({ filePath, layout, pageFrom, pageTo }) => {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  const opts: string[] = [];
  if (layout) opts.push("-layout");
  if (pageFrom) opts.push(`-f ${pageFrom}`);
  if (pageTo) opts.push(`-l ${pageTo}`);
  const text = extractWithPoppler(filePath, opts);
  return { content: [{ type: "text" as const, text: JSON.stringify({ filePath, charCount: text.length, text }, null, 2) }] };
});

server.tool("extract_tables", "Extract tables from a PDF (layout mode for better table detection).", {
  filePath: z.string(),
  page: z.number().optional().describe("Specific page number"),
}, async ({ filePath, page }) => {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  const opts = ["-layout"];
  if (page) { opts.push(`-f ${page}`, `-l ${page}`); }
  const text = extractWithPoppler(filePath, opts);
  // Try to detect table-like structures (lines with multiple spaces as delimiters)
  const lines = text.split("\n").filter((l) => l.trim());
  const tableLines = lines.filter((l) => (l.match(/\s{2,}/g) || []).length >= 2);
  return { content: [{ type: "text" as const, text: JSON.stringify({
    filePath, totalLines: lines.length, tableLines: tableLines.length,
    tables: tableLines.join("\n"),
    fullText: text,
  }, null, 2) }] };
});

server.tool("get_pdf_info", "Get metadata and page count from a PDF.", {
  filePath: z.string(),
}, async ({ filePath }) => {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  try {
    const info = execSync(`pdfinfo "${filePath}"`, { maxBuffer: 1024 * 1024 }).toString();
    const meta: Record<string, string> = {};
    for (const line of info.split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(meta, null, 2) }] };
  } catch {
    throw new Error("pdfinfo not found. Install poppler.");
  }
});

server.tool("extract_page_range", "Extract text from specific pages.", {
  filePath: z.string(),
  fromPage: z.number().min(1),
  toPage: z.number().min(1),
}, async ({ filePath, fromPage, toPage }) => {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  const text = extractWithPoppler(filePath, [`-f ${fromPage}`, `-l ${toPage}`]);
  return { content: [{ type: "text" as const, text: JSON.stringify({ filePath, fromPage, toPage, text }, null, 2) }] };
});

async function main() { const t = new StdioServerTransport(); await server.connect(t); }
main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
