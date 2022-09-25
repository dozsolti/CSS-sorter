"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const Main = (editor, sortType) => {
    const editorText = utils_1.GetTextFromEditor(editor);
    const cssAsJson = utils_1.TextToJson(editorText);
    utils_1.OrderCSS(cssAsJson, sortType);
    const newCSS = utils_1.JSONToText(cssAsJson);
    utils_1.ReplaceFileContent(editor, newCSS);
    return vscode_1.window.showInformationMessage("Reorder successfully");
};
function activate(context) {
    const disposable = vscode_1.commands.registerCommand("extension.sortcss", () => {
        try {
            const editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                throw new Error("No open text editor");
            }
            Main(editor, "importante");
            return vscode_1.window.showInformationMessage("Reorder successfully");
        }
        catch (err) {
            console.log(err);
            return vscode_1.window.showErrorMessage(err + "");
        }
    });
    const disposableAlphabetical = vscode_1.commands.registerCommand("extension.sortcssalphabetical", () => {
        try {
            const editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                throw new Error("No open text editor");
            }
            Main(editor, "alphabetical");
            return vscode_1.window.showInformationMessage("Reorder successfully");
        }
        catch (err) {
            console.log(err);
            return vscode_1.window.showErrorMessage(err + "");
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableAlphabetical);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map