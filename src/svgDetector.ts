import { TextDocument } from "vscode";
import * as Config from "./configuration";

const SVG_OPEN_CLOSE = /<svg\b[^>]*>([\s\S]*?)<\/svg>/gi;

export interface SvgBlock {
  startLine: number;
  endLine: number;
}

export function detectSvgBlocks(document: TextDocument): SvgBlock[] {
  const threshold = Config.get<number>("foldLengthThreshold") ?? 20;
  const text = document.getText();
  const regex = new RegExp(SVG_OPEN_CLOSE.source, "gi");
  const blocks: SvgBlock[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1].length < threshold) continue;

    const startLine = document.positionAt(match.index).line;
    const closingIdx = match.index + match[0].lastIndexOf("</svg>");
    const endLine = document.positionAt(closingIdx).line;

    if (endLine > startLine) {
      blocks.push({ startLine, endLine });
    }
  }

  return blocks;
}
