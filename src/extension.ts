// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const CSSJSON = require("cssjson");

const theOrder: any = require('./order');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "CSS-sorter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.sortcss', () => {
		// The code you place here will be executed every time your command is executed

		var editor = vscode.window.activeTextEditor;

		if (!editor) {
			return vscode.window.showErrorMessage("no Open text editor");
		}

		let originalFileContent = editor.document.getText();
		let css = CSSJSON.toJSON(originalFileContent);

		Order(css, 'importante');

		let newCss = CSSJSON.toCSS(css);

		var lastLine = editor.document.lineAt(editor.document.lineCount - 1);

		let allDocumentRange = new vscode.Range(0, 0, editor.document.lineCount - 1, lastLine.range.end.character + 1);

		editor.edit(editBuilder => {
			editBuilder.replace(allDocumentRange, newCss);
		});



		return vscode.window.showInformationMessage("Reorder successfully");
	});

	let disposableAlphabetical = vscode.commands.registerCommand('extension.sortcssalphabetical', () => {
		// The code you place here will be executed every time your command is executed

		var editor = vscode.window.activeTextEditor;

		if (!editor) {
			return vscode.window.showErrorMessage("no Open text editor");
		}

		let originalFileContent = editor.document.getText();
		let css = CSSJSON.toJSON(originalFileContent);

		Order(css, 'alphabetical');

		let newCss = CSSJSON.toCSS(css);

		var lastLine = editor.document.lineAt(editor.document.lineCount - 1);

		let allDocumentRange = new vscode.Range(0, 0, editor.document.lineCount - 1, lastLine.range.end.character + 1);

		editor.edit(editBuilder => {
			editBuilder.replace(allDocumentRange, newCss);
		});



		return vscode.window.showInformationMessage("Reorder successfully");
	});
	context.subscriptions.push(disposable);
}

function Order(css: any, orderType:string){
	if(orderType == "importante"){
		css['attributes'] = sortAttributesImportante(css['attributes']);
	}
	else if(orderType == "alphabetical"){
		css['attributes'] = sortAttributesAlfabeticly(css['attributes']);
	}
	for(let childKey of Object.keys(css['children'])){
		Order(css['children'][childKey],orderType);
	}
}
function sortAttributesAlfabeticly(attributes: any) {
	let attributesKeys = Object.keys(attributes);
	if (attributesKeys.length < 2) {
		return attributes;
	}

	return attributesKeys.sort()
		.reduce((acc: any, key) => {
			acc[key] = attributes[key];
			return acc;
		}, {});
}

function sortAttributesImportante(attributes: any) {
	let attributesKeys = Object.keys(attributes);
	if (attributesKeys.length < 2) {
		return attributes;
	}

	let newOrder: any = { ...theOrder };
	let orderKeys = Object.keys(newOrder);
	for (let key of orderKeys) {
		newOrder[key] = attributes[key];
	}

	let diferenceKeys = attributesKeys.filter(x => !orderKeys.includes(x));
	for (let key of diferenceKeys) {
		newOrder[key] = attributes[key];
	}

	for (let key of orderKeys) {
		if (newOrder[key] == undefined) {
			delete newOrder[key];
		}
	}

	return newOrder;
}
// this method is called when your extension is deactivated
export function deactivate() {}
