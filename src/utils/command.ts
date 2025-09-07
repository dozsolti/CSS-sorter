import * as vscode from "vscode";
import { LanguageId } from "../types";

export async function replaceEditorContent(
  editor: vscode.TextEditor | undefined,
  callback: (text: string, languageId: LanguageId) => Promise<string>
) {
  if (!editor) {
    vscode.window.showInformationMessage("No active editor found.");
    return;
  }
  const document = editor.document;
  const text = document.getText();

  const sortedText = await callback(text, document.languageId as LanguageId);

  editor.edit((editBuilder) => {
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const fullRange = new vscode.Range(
      firstLine.range.start,
      lastLine.range.end
    );
    editBuilder.replace(fullRange, sortedText);
  });
}
