import * as vscode from "vscode";
import { getSvgFoldingRanges, SvgFoldingProvider } from "./foldingProvider";
import * as Config from "./configuration";

const LANGUAGES = ["html", "php", "blade", "javascriptreact", "typescriptreact", "vue", "svelte", "svg", "xml"];
const FOLDED_DOCS = new Set<string>();

async function foldSvgsInEditor(editor: vscode.TextEditor) {
  const doc = editor.document;
  if (!LANGUAGES.includes(doc.languageId)) return;
  if (!(Config.get<boolean>("autoFold") ?? true)) return;

  const uri = doc.uri.toString();
  if (FOLDED_DOCS.has(uri)) return;
  FOLDED_DOCS.add(uri);

  const ranges = getSvgFoldingRanges(doc);
  if (ranges.length === 0) return;

  // Pequeño retraso para que el editor haya calculado los rangos de plegado
  await new Promise<void>((r) => setTimeout(r, 50));

  const startLines = ranges.map((r) => r.start);
  await vscode.commands.executeCommand("editor.fold", {
    selectionLines: startLines,
  });
}

function onEditorActivated() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  foldSvgsInEditor(editor);
}

export function activate(context: vscode.ExtensionContext) {
  const foldingProvider = new SvgFoldingProvider();
  const foldingDisposable = vscode.languages.registerFoldingRangeProvider(
    LANGUAGES.map((lang) => ({ language: lang })),
    foldingProvider
  );

  // Plegar al abrir archivo o al cambiar de editor
  const onOpen = vscode.workspace.onDidOpenTextDocument((doc) => {
    if (!LANGUAGES.includes(doc.languageId)) return;
    const editor = vscode.window.visibleTextEditors.find(
      (e) => e.document.uri.toString() === doc.uri.toString()
    );
    if (editor && editor === vscode.window.activeTextEditor) {
      foldSvgsInEditor(editor);
    }
  });

  // No limpiar FOLDED_DOCS al cerrar: así no replegamos al reabrir.
  // Si lo hiciéramos, editor.fold plegaría el padre (div) porque el SVG ya está plegado.

  const onActiveEditor = vscode.window.onDidChangeActiveTextEditor(() => {
    onEditorActivated();
  });

  // Plegar al activar (p. ej. archivos ya abiertos al iniciar)
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
      const ranges = getSvgFoldingRanges(editor.document);
      if (ranges.length === 0) return;
      await vscode.commands.executeCommand("editor.fold", {
        selectionLines: ranges.map((r) => r.start),
      });
    }
  );

  context.subscriptions.push(
    foldingDisposable,
    onOpen,
    onActiveEditor,
    toggleCommand,
    collapseAllCommand
  );
}

export function deactivate() {
  FOLDED_DOCS.clear();
}
