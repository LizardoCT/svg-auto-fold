import { DecorationOptions, Range, TextEditor } from "vscode";
import * as Config from "./configuration";
import {
  createFoldedDecorationType,
  createUnfoldedDecorationType,
} from "./decorations";

/**
 * Detecta bloques <svg>...</svg> (incluyendo multilínea).
 * Grupo 1 = contenido entre la apertura y </svg> (desde > hasta </svg>)
 * Grupo 0 = match completo para calcular rangos
 */
const SVG_BLOCK_REGEX = /<svg[\s\S]*?>([\s\S]*?)<\/svg>/gi;

export class Decorator {
  private activeEditor: TextEditor | undefined;
  private autoFold = true;
  private unfoldedDecorationType = createUnfoldedDecorationType();
  private foldedDecorationType = createFoldedDecorationType();

  setActiveEditor(editor: TextEditor | undefined): void {
    this.activeEditor = editor;
    this.updateDecorations();
  }

  loadConfig(): void {
    this.autoFold = Config.get<boolean>("autoFold") ?? true;
    this.unfoldedDecorationType.dispose();
    this.foldedDecorationType.dispose();
    this.unfoldedDecorationType = createUnfoldedDecorationType();
    this.foldedDecorationType = createFoldedDecorationType();
    this.updateDecorations();
  }

  toggleAutoFold(): boolean {
    this.autoFold = !this.autoFold;
    Config.set("autoFold", this.autoFold);
    this.updateDecorations();
    return this.autoFold;
  }

  updateDecorations(): void {
    if (!this.activeEditor) return;

    try {
      this.applyDecorations();
    } catch (err) {
      // Silenciar errores de decoración para no interrumpir al usuario
    }
  }

  private applyDecorations(): void {
    if (!this.activeEditor) return;

    const doc = this.activeEditor.document;
    const langId = doc.languageId;
    const supportedLanguages: string[] =
      Config.get<string[]>("supportedLanguages") ?? [
        "html",
        "javascriptreact",
        "typescriptreact",
        "vue",
        "svelte",
        "svg",
        "xml",
      ];

    if (!supportedLanguages.includes(langId)) return;

    const unfoldOnLineSelect =
      Config.get<boolean>("unfoldOnLineSelect") ?? true;
    const threshold =
      Config.get<number>("foldLengthThreshold") ?? 20;

    const foldedRanges: DecorationOptions[] = [];
    const unfoldedRanges: Range[] = [];

    const text = doc.getText();
    const regex = new RegExp(SVG_BLOCK_REGEX.source, "gi");
    let match;

    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const content = match[1];

      if (content.length < threshold) continue;

      // Solo decorar el CONTENIDO interno; las etiquetas <svg...> y </svg> siempre visibles
      const contentStartInMatch = fullMatch.indexOf(content);
      const contentStartIndex = match.index + contentStartInMatch;
      const contentEndIndex = contentStartIndex + content.length;

      const startPos = doc.positionAt(contentStartIndex);
      const endPos = doc.positionAt(contentEndIndex);
      const range = new Range(startPos, endPos);

      const shouldUnfold =
        !this.autoFold ||
        this.isRangeSelected(range) ||
        (unfoldOnLineSelect && this.isLineOfRangeSelected(range));

      if (shouldUnfold) {
        unfoldedRanges.push(range);
      } else {
        foldedRanges.push({
          range,
          hoverMessage: content.length > 500 ? content.slice(0, 500) + "…" : content,
        });
      }
    }

    this.activeEditor.setDecorations(this.unfoldedDecorationType, unfoldedRanges);
    this.activeEditor.setDecorations(this.foldedDecorationType, foldedRanges);
  }

  private isRangeSelected(range: Range): boolean {
    if (!this.activeEditor) return false;
    return !!(
      this.activeEditor.selection.contains(range) ||
      this.activeEditor.selections.some((s) => range.contains(s))
    );
  }

  private isLineOfRangeSelected(range: Range): boolean {
    if (!this.activeEditor) return false;
    return this.activeEditor.selections.some((s) => {
      const line = s.start.line;
      return line >= range.start.line && line <= range.end.line;
    });
  }

  dispose(): void {
    this.unfoldedDecorationType.dispose();
    this.foldedDecorationType.dispose();
  }
}
