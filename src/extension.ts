import { commands, ExtensionContext, TextEditor, window } from "vscode";
import { GetTextFromEditor, TextToJson, JSONToText, OrderCSS, ReplaceFileContent } from "./utils";

const Main = (editor: TextEditor, sortType: string) => {
	const editorText = GetTextFromEditor(editor);
	const cssAsJson = TextToJson(editorText);

	OrderCSS(cssAsJson, sortType);

	const newCSS = JSONToText(cssAsJson);

	ReplaceFileContent(editor, newCSS);

	return window.showInformationMessage("Reorder successfully");
};

export function activate(context: ExtensionContext) {
	const disposable = commands.registerCommand("extension.sortcss", () => {
		try {
			const editor = window.activeTextEditor;
			if (!editor) {
				throw new Error("No open text editor");
			}

			Main(editor, "importante");

			return window.showInformationMessage("Reorder successfully");
		} catch (err) {
			console.log(err);
			return window.showErrorMessage(err + "");
		}
	});

	const disposableAlphabetical = commands.registerCommand(
		"extension.sortcssalphabetical",
		() => {
			try {
				const editor = window.activeTextEditor;
				if (!editor) {
					throw new Error("No open text editor");
				}

				Main(editor, "alphabetical");

				return window.showInformationMessage("Reorder successfully");
			} catch (err) {
				console.log(err);
				return window.showErrorMessage(err + "");
			}
		}
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableAlphabetical);
}

// this method is called when your extension is deactivated
export function deactivate() { }