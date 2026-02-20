# Changelog

## [0.1.5] - 2025-02-19

### Fixed

- Removed custom FoldingRangeProvider entirely. Registering one disabled indentation-based folding in PHP/Blade, causing all non-SVG fold toggles to disappear.
- Now uses only `editor.fold` on detected SVG lines, preserving the editor's native folding for all other elements.
- Fixed parent element collapsing on reopen: the editor remembers folds between sessions, so re-folding an already-folded SVG would fold the parent div instead. Now unfolds SVG lines first before folding.
- Removed unused decorator/decorations code (legacy from Tailwind-style approach).

## [0.1.3] - 2025-02-17

### Changed

- README improved: clearer installation steps, manual .vsix option
- Description synced with README for Marketplace display

## [0.1.2] - 2025-02-17

### Changed

- Description updated: reflects native folding instead of Tailwind-style

## [0.1.1] - 2025-02-17

### Changed

- README updated to English and user-focused
- Removed publishing instructions from README

## [0.1.0] - 2025-02-17

### Añadido

- Colapso automático de bloques `<svg>...</svg>` al abrir archivos
- Soporte para HTML, PHP, Blade, JSX, TSX, Vue, Svelte, SVG y XML
- Comando "SVG Fold: Alternar colapso" (Ctrl+Alt+S)
- Comando "SVG Fold: Colapsar todos los SVG"
- Configuración `svgFold.autoFold` para activar/desactivar
- Configuración `svgFold.foldLengthThreshold` para filtrar SVGs cortos
- Configuración `svgFold.supportedLanguages` para elegir idiomas
