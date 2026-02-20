import * as vscode from "vscode";
import { detectSvgBlocks } from "./svgDetector";
import * as Config from "./configuration";

const LANGUAGES = [
  "html", "php", "blade",
  "javascriptreact", "typescriptreact",
  "vue", "svelte", "svg", "xml",
];

const FOLDED_DOCS = new Set<string>();

async function foldSvgsInEditor(editor: vscode.TextEditor) {
  const doc = editor.document;
  if (!LANGUAGES.includes(doc.languageId)) return;
  if (!(Config.get<boolean>("autoFold") ?? true)) return;

  const uri = doc.uri.toString();
  if (FOLDED_DOCS.has(uri)) return;
  FOLDED_DOCS.add(uri);

  const blocks = detectSvgBlocks(doc);
  if (blocks.length === 0) return;

  await new Promise<void>((r) => setTimeout(r, 120));

  const lines = blocks.map((b) => b.startLine);

  // Desplegar primero: el editor recuerda folds entre sesiones.
  // Si el SVG ya está plegado, editor.fold plegaría el padre (div).
  await vscode.commands.executeCommand("editor.unfold", {
    selectionLines: lines,
  });

  await vscode.commands.executeCommand("editor.fold", {
    selectionLines: lines,
  });
}

export function activate(context: vscode.ExtensionContext) {
  // No registramos FoldingRangeProvider: hacerlo desactiva el plegado
  // por indentación en lenguajes como PHP que dependen de él.
  // En su lugar usamos editor.fold sobre los rangos nativos del editor.

  const onOpen = vscode.workspace.onDidOpenTextDocument((doc) => {
    if (!LANGUAGES.includes(doc.languageId)) return;
    const editor = vscode.window.visibleTextEditors.find(
      (e) => e.document.uri.toString() === doc.uri.toString()
    );
    if (editor && editor === vscode.window.activeTextEditor) {
      foldSvgsInEditor(editor);
    }
  });

  const onActiveEditor = vscode.window.onDidChangeActiveTextEditor(() => {
    const editor = vscode.window.activeTextEditor;
    if (editor) foldSvgsInEditor(editor);
  });

  if (vscode.window.activeTextEditor) {
    foldSvgsInEditor(vscode.window.activeTextEditor);
  }

  const toggleCommand = vscode.commands.registerCommand(
    "svgFold.toggle",
    () => {
      const current = Config.get<boolean>("autoFold") ?? true;
      Config.set("autoFold", !current);
      vscode.window.showInformationMessage(
        `SVG Fold: ${!current ? "Colapsado" : "Expandido"}`
      );
    }
  );

  const collapseAllCommand = vscode.commands.registerCommand(
    "svgFold.collapseAll",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const blocks = detectSvgBlocks(editor.document);
      if (blocks.length === 0) return;
      await vscode.commands.executeCommand("editor.fold", {
        selectionLines: blocks.map((b) => b.startLine),
      });
    }
  );

  context.subscriptions.push(onOpen, onActiveEditor, toggleCommand, collapseAllCommand);
}

export function deactivate() {
  FOLDED_DOCS.clear();
}
