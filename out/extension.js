"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const CSSJSON = require("cssjson");
const theOrder = require('./order');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "CSS-sorter" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sortcss', () => {
        try {
            // The code you place here will be executed every time your command is executed
            var editor = vscode.window.activeTextEditor;
            if (!editor) {
                return vscode.window.showErrorMessage("no Open text editor");
            }
            let originalFileContent = editor.document.getText();
            let css = CSSJSON.toJSON(originalFileContent, {
                ordered: true,
                comments: true
            });
            css = formatter(css);
            Order(css, 'importante');
            let newCss = CSSJSON.toCSS(css);
            var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
            let allDocumentRange = new vscode.Range(0, 0, editor.document.lineCount - 1, lastLine.range.end.character + 1);
            editor.edit(editBuilder => {
                editBuilder.replace(allDocumentRange, newCss);
            });
            return vscode.window.showInformationMessage("Reorder successfully");
        }
        catch (err) {
            console.log(err);
            return vscode.window.showErrorMessage(err);
        }
    });
    let disposableAlphabetical = vscode.commands.registerCommand('extension.sortcssalphabetical', () => {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return vscode.window.showErrorMessage("no Open text editor");
        }
        let originalFileContent = editor.document.getText();
        let css = CSSJSON.toJSON(originalFileContent, {
            ordered: true,
            comments: true
        });
        css = formatter(css);
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
exports.activate = activate;
function formatter(start) {
    let end = { attributes: {}, children: {} };
    for (let k in start) {
        let val = start[k];
        if ((typeof val) == 'string') {
            let keyOfAComment = 'this is a Zascal Key ' + Object.keys(end.children).length + 1;
            end.children[keyOfAComment] = val;
        }
        else {
            if ((typeof val.value) == 'string') {
                end.children[val.name] = val.value;
            }
            else {
                let attrs = val.value;
                for (let attrKey in attrs) {
                    if (!(val.name in end.children))
                        end.children[val.name] = { attributes: {}, children: {} };
                    if (attrs[attrKey].name)
                        end.children[val.name].attributes[attrs[attrKey].name] = attrs[attrKey].value;
                }
            }
        }
    }
    return end;
}
function Order(css, orderType) {
    if (orderType == "importante") {
        css['attributes'] = sortAttributesImportante(css['attributes']);
    }
    else if (orderType == "alphabetical") {
        css['attributes'] = sortAttributesAlfabeticly(css['attributes']);
    }
    for (let childKey of Object.keys(css['children'])) {
        if ((typeof css['children'][childKey]) != 'string')
            Order(css['children'][childKey], orderType);
    }
}
function sortAttributesAlfabeticly(attributes) {
    let attributesKeys = Object.keys(attributes);
    if (attributesKeys.length < 2) {
        return attributes;
    }
    return attributesKeys.sort()
        .reduce((acc, key) => {
        acc[key] = attributes[key];
        return acc;
    }, {});
}
function sortAttributesImportante(attributes) {
    let attributesKeys = Object.keys(attributes);
    if (attributesKeys.length < 2) {
        return attributes;
    }
    let newOrder = Object.assign({}, theOrder);
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map