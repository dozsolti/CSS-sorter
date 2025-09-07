import * as vscode from "vscode";
import { replaceEditorContent } from "./utils/command";
import { sort } from "./utils/sort";

const commandNameByImportance = "css-sorter.sortByImportance";
const commandNameAlphabetical = "css-sorter.sortAlphabetical";

async function commandSortByImportance() {
  await replaceEditorContent(
    vscode.window.activeTextEditor,
    (text, languageId) => sort(text, "importance", languageId)
  );
}

async function commandSortAlphabetical() {
  await replaceEditorContent(
    vscode.window.activeTextEditor,
    (text, languageId) => sort(text, "alphabetical", languageId)
  );
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      commandNameByImportance,
      commandSortByImportance
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      commandNameAlphabetical,
      commandSortAlphabetical
    )
  );
}

export function deactivate() {}
