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

The tools run the external Poppler programs `pdftotext` and `pdfinfo`. Install both before you use this server. This package does not install them, and it has no other extractor when they are missing.

### Prerequisites

- Node.js and npm
- Poppler, with both `pdftotext` and `pdfinfo` on your `PATH`

Install Poppler:

```bash
# macOS (Homebrew)
brew install poppler

# Debian or Ubuntu
sudo apt install poppler-utils
```

Those match the install hints the tools print when a command is missing (`brew install poppler` or `apt install poppler-utils`). On another system, install a Poppler package that provides both programs on `PATH`.

Check that both programs are available:

```bash
command -v pdftotext
command -v pdfinfo
pdftotext -v
pdfinfo -v
```

`command -v` prints the path of each program. If it prints nothing, that program is not on `PATH`. `pdftotext -v` and `pdfinfo -v` print the Poppler version when the program is installed (Poppler writes that text to standard error). If a check fails, install Poppler and open a new terminal so the updated `PATH` is visible.

### Build

```bash
git clone https://github.com/PetrefiedThunder/mcp-pdf-extract.git
cd mcp-pdf-extract
npm install
npm run build
```

`npm install` and `npm run build` install Node dependencies and compile TypeScript. They do not install `pdftotext` or `pdfinfo`.

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
