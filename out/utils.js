"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const customParser_1 = require("./customParser");
const CSSJSON = require("cssjson");
//#region Preproccessing
function GetTextFromEditor(editor) {
    return editor.document.getText();
}
exports.GetTextFromEditor = GetTextFromEditor;
function TextToJson(text) {
    let css = customParser_1.ToJson(text);
    return css;
}
exports.TextToJson = TextToJson;
function formatCSS(start) {
    let end = { attributes: {}, children: {} };
    for (let k in start) {
        let val = start[k];
        if (typeof val === "string") {
            let keyOfAComment = "this is a Zascal Key " + Object.keys(end.children).length + 1;
            end.children[keyOfAComment] = val;
        }
        else {
            if (typeof val.value === "undefined") {
                continue;
            }
            end.children[val.name] = formatCSSParseNode(val);
        }
    }
    return end;
}
function formatCSSParseNode(node) {
    if (node["type"] === "attr") {
        let obj = {};
        obj[node.name] = node.value;
        return obj;
    }
    else if (node["type"] === "rule") {
        let numbers = Object.keys(node.value).filter((x) => ["attributes", "children"].indexOf(x) === -1);
        let obj = {
            attributes: {},
            children: {},
        };
        for (let k of numbers) {
            let subNode = node.value[k];
            let result = formatCSSParseNode(subNode);
            for (let resultK in result) {
                if (subNode["type"] === "attr") {
                    obj.attributes[resultK] = result[resultK];
                }
                else if (subNode["type"] === "rule") {
                    obj.children[node.value[k].name] = result;
                }
            }
        }
        return obj;
    }
    return JSON.stringify(node);
}
//#region
//#region Proccessing
const theOrder = require("./order");
function OrderCSS(css, orderType) {
    return;
    if (orderType === "importante") {
        css["attributes"] = sortAttributesImportante(css["attributes"]);
    }
    else if (orderType === "alphabetical") {
        css["attributes"] = sortAttributesAlfabeticly(css["attributes"]);
    }
    for (let childKey of Object.keys(css["children"])) {
        if (typeof css["children"][childKey] !== "string") {
            OrderCSS(css["children"][childKey], orderType);
        }
    }
}
exports.OrderCSS = OrderCSS;
function sortAttributesAlfabeticly(attributes) {
    let attributesKeys = Object.keys(attributes);
    if (attributesKeys.length < 2) {
        return attributes;
    }
    return attributesKeys.sort().reduce((acc, key) => {
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
    let diferenceKeys = attributesKeys.filter((x) => !orderKeys.includes(x));
    for (let key of diferenceKeys) {
        newOrder[key] = attributes[key];
    }
    for (let key of orderKeys) {
        if (newOrder[key] === undefined) {
            delete newOrder[key];
        }
    }
    return newOrder;
}
//#endregion
//#region PostProccessing
function JSONToText(json) {
    return JSON.stringify(json, null, 2); //CSSJSON.toCSS(json);
}
exports.JSONToText = JSONToText;
function ReplaceFileContent(editor, newCSS) {
    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    const allDocumentRange = new vscode_1.Range(0, 0, editor.document.lineCount - 1, lastLine.range.end.character + 1);
    editor.edit((editBuilder) => {
        editBuilder.replace(allDocumentRange, newCSS);
    });
}
exports.ReplaceFileContent = ReplaceFileContent;
//#endregion
//# sourceMappingURL=utils.js.map