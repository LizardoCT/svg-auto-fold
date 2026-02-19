# SVG Auto Fold

Automatically collapses inline `<svg>` blocks when opening files, making large files easier to read and navigate.
Ideal for projects that use inline SVGs with long `<path>` definitions that can span dozens or hundreds of lines.
The extension uses the editor’s **native folding system**, so SVG blocks are collapsed cleanly and can be expanded normally using standard fold controls — without modifying your code.

[![Install](https://img.shields.io/badge/Marketplace-Install-0078D4?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=lizardo-dev.svg-auto-fold)

## Installation

### From the Extensions Marketplace (Recommended)

1. Open your code editor (any VSCode-based editor).
2. Go to **Extensions** (`Ctrl + Shift + X`).
3. Search for **"SVG Auto Fold"**.
4. Click **Install**.

---

### Install via Command (VSCode CLI)

If your editor supports the VSCode CLI, run:

```
code --install-extension lizardo-dev.svg-auto-fold
```

Or from Quick Open (`Ctrl + P`):

```
ext install lizardo-dev.svg-auto-fold
```

---

### Manual Installation (.vsix)

If the extension is not yet visible in your editor’s marketplace:

1. Download the `.vsix` package.
2. Open **Extensions**.
3. Select **Install from VSIX…**
4. Choose the downloaded file.

## What it does

- **On file open**, inline `<svg>` blocks are automatically collapsed (HTML, PHP, JSX, Vue, etc.)
- The `<svg>` and `</svg>` tags remain visible while the inner content is folded
- You can expand any SVG using the editor’s standard fold controls

Before:

```html
<svg viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5z" />
  <circle cx="12" cy="12" r="10" />
</svg>
```

After (collapsed):

```html
<svg viewBox="0 0 24 24">...
</svg>
```

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| SVG Fold: Toggle collapse | Ctrl+Alt+S | Enable or disable auto-collapse when opening files |
| SVG Fold: Collapse all SVG | — | Collapse only SVG blocks in the current file |

## Configuration

Configure under **Settings** → **Extensions** → **SVG Auto Fold**:

| Option | Default | Description |
|--------|---------|-------------|
| `svgFold.autoFold` | `true` | Auto-collapse when opening files |
| `svgFold.foldLengthThreshold` | `20` | Minimum characters to collapse (skips very short SVGs) |
| `svgFold.supportedLanguages` | `html, php, blade, jsx, vue...` | Languages where the extension applies |

## Supported languages

HTML, PHP, Blade, JavaScript React, TypeScript React, Vue, Svelte, SVG, and XML.

## License

MIT
