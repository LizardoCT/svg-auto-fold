import {
  DecorationRangeBehavior,
  TextEditorDecorationType,
  window,
} from "vscode";
import * as Config from "./configuration";

export function createUnfoldedDecorationType(): TextEditorDecorationType {
  return window.createTextEditorDecorationType({
    rangeBehavior: DecorationRangeBehavior.ClosedOpen,
    opacity: "1",
  });
}

export function createFoldedDecorationType(): TextEditorDecorationType {
  const foldedText = Config.get<string>("foldedText") ?? "•••";

  return window.createTextEditorDecorationType({
    before: {
      contentText: foldedText,
      backgroundColor: "transparent",
      color: "#7cdbfe7e",
    },
    textDecoration: "none; display: none;",
    rangeBehavior: DecorationRangeBehavior.ClosedOpen,
  });
}
