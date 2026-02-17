import {
  FoldingRange,
  FoldingRangeKind,
  FoldingRangeProvider,
  TextDocument,
} from "vscode";
import * as Config from "./configuration";

const SVG_BLOCK_REGEX = /<svg[\s\S]*?>([\s\S]*?)<\/svg>/gi;

export class SvgFoldingProvider implements FoldingRangeProvider {
  provideFoldingRanges(
    document: TextDocument,
    _context: import("vscode").FoldingContext,
    _token: import("vscode").CancellationToken
  ): FoldingRange[] {
    const langId = document.languageId;
    const supportedLanguages: string[] =
      Config.get<string[]>("supportedLanguages") ?? [
        "html",
        "php",
        "blade",
        "javascriptreact",
        "typescriptreact",
        "vue",
        "svelte",
        "svg",
        "xml",
      ];

    if (!supportedLanguages.includes(langId)) return [];

    const autoFold = Config.get<boolean>("autoFold") ?? true;
    if (!autoFold) return [];

    const threshold = Config.get<number>("foldLengthThreshold") ?? 20;

    const ranges: FoldingRange[] = [];
    const text = document.getText();
    const regex = new RegExp(SVG_BLOCK_REGEX.source, "gi");
    let match;

    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const content = match[1];

      if (content.length < threshold) continue;

      // Rango: desde <svg> hasta antes de </svg> (el </svg> queda visible)
      const startLine = document.positionAt(match.index).line;
      const closeTagStart = match.index + fullMatch.indexOf("</svg>");
      const endLine = document.positionAt(closeTagStart).line - 1;

      if (endLine >= startLine) {
        ranges.push(
          new FoldingRange(startLine, endLine, FoldingRangeKind.Region)
        );
      }
    }

    return ranges;
  }
}

/** Obtiene los rangos de plegado para un documento (usado al abrir archivo). */
export function getSvgFoldingRanges(document: TextDocument): FoldingRange[] {
  const provider = new SvgFoldingProvider();
  const noCancel = { get isCancellationRequested() { return false; } };
  return provider.provideFoldingRanges(
    document,
    {} as import("vscode").FoldingContext,
    noCancel as import("vscode").CancellationToken
  );
}
