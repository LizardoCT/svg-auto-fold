# SVG Auto Fold

Automatically collapses SVG blocks when opening files. Ideal for navigating code with many icons or SVGs spanning hundreds of lines.

[![Install](https://img.shields.io/badge/Marketplace-Install-0078D4?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=lizardo-dev.svg-auto-fold)

## Installation

### From the Marketplace (recommended)

1. Open **VSCode** or **Cursor**
2. Go to **Extensions** (Ctrl+Shift+X)
3. Search for **"SVG Auto Fold"** or **"lizardo-dev"**
4. Click **Install**

Alternatively, press **Ctrl+P** and run:

```
ext install lizardo-dev.svg-auto-fold
```

## What it does

- **When you open a file** with SVG (HTML, PHP, JSX, Vue, etc.), all `<svg>` blocks are automatically collapsed
- **You'll see** the `<svg>` and `</svg>` tags with the content hidden in between
- **To expand**, click the arrow next to the SVG you want to view

Before:

```html
<svg viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5z"/>
  <circle cx="12" cy="12" r="10"/>
</svg>
```

After (collapsed):

```html
<svg viewBox="0 0 24 24">
  ... 2 lines ...
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
