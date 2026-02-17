# SVG Auto Fold

Colapsa automáticamente el contenido de los bloques SVG al abrir archivos. Ideal para navegar código con muchos SVGs o íconos de cientos de líneas.

- **Al abrir:** todos los SVG aparecen colapsados (etiquetas `<svg>` y `</svg>` visibles, contenido oculto)
- **Colapso real:** usa el plegado nativo de VSCode (las líneas se ocultan, no solo visualmente)
- **Navegación:** expande con un clic en la flecha cuando necesites ver el contenido

## Uso

1. Abre un archivo HTML, PHP, Blade, JSX, TSX, Vue, Svelte o SVG
2. Los bloques SVG se colapsan automáticamente; verás `<svg...>` y `</svg>` con el contenido entre medias plegado
3. Haz clic en la flecha para expandir el SVG que quieras editar

## Comandos

- **SVG Fold: Alternar colapso** (Ctrl+Alt+S) — Activa o desactiva el colapso automático al abrir
- **SVG Fold: Colapsar todos los SVG** — Colapsa solo los SVG del archivo actual (sin afectar funciones, clases, etc.)

## Configuración

| Clave | Default | Descripción |
|-------|---------|-------------|
| `svgFold.autoFold` | `true` | Colapsar automáticamente al abrir archivos |
| `svgFold.foldLengthThreshold` | `20` | Mín. caracteres del contenido para colapsar |
| `svgFold.supportedLanguages` | `["html","php","blade",...]` | Lenguajes donde aplicar |

## Desarrollar

```bash
npm install
npm run compile
# F5 en VSCode para probar
```

## Publicar en el Marketplace

### 1. Requisitos previos

- Cuenta en [Azure DevOps](https://dev.azure.com) (gratuita)
- [Node.js](https://nodejs.org) instalado

### 2. Crear publicador

1. Entra en [marketplace.visualstudio.com](https://marketplace.visualstudio.com)
2. Inicia sesión con tu cuenta Microsoft
3. Haz clic en tu avatar → **Create Publisher**
4. Elige un ID (ej: `tu-usuario`) y complétalo

### 3. Actualizar package.json

El publisher `lizardo-dev` ya está configurado. Si tu repo de GitHub tiene otro nombre de usuario, edita `repository.url`, `homepage` y `bugs.url` en `package.json`.

### 4. Instalar vsce y empaquetar

```bash
npm install -g @vscode/vsce
npm run package
```

Esto genera `svg-auto-fold-0.1.0.vsix`.

### 5. Publicar

```bash
vsce publish
```

La primera vez te pedirá un Personal Access Token de Azure DevOps con permisos **Packaging (Read & Write)**.

### Instalación manual (.vsix)

Para instalar el .vsix sin publicar:

1. `npm run package` para generar el .vsix
2. En VSCode: Extensions → menú ⋯ → **Install from VSIX...**
3. Selecciona `svg-auto-fold-0.1.0.vsix`
