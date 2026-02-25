# mcp-pdf-extract

Extract text and tables from PDF files using poppler (pdftotext/pdfinfo).

> **Free API** — No API key required.

## Tools

| Tool | Description |
|------|-------------|
| `extract_text` | Extract all text from a PDF file. |
| `extract_tables` | Extract tables from a PDF (layout mode for better table detection). |
| `get_pdf_info` | Get metadata and page count from a PDF. |
| `extract_page_range` | Extract text from specific pages. |

## Installation

```bash
git clone https://github.com/PetrefiedThunder/mcp-pdf-extract.git
cd mcp-pdf-extract
npm install
npm run build
```

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pdf-extract": {
      "command": "node",
      "args": ["/path/to/mcp-pdf-extract/dist/index.js"]
    }
  }
}
```

## Usage with npx

```bash
npx mcp-pdf-extract
```

## License

MIT
