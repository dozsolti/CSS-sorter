import { Range, TextEditor } from "vscode";
import { ToJson } from "./customParser";
const CSSJSON = require("cssjson");

//#region Preproccessing
export function GetTextFromEditor(editor: TextEditor) {
    return editor.document.getText();
}
export function TextToJson(text: string) {
    let css = ToJson(text);
    return css;
}
function formatCSS(start: any) {
    let end: any = { attributes: {}, children: {} };

    for (let k in start) {
        let val = start[k];
        if (typeof val === "string") {
            let keyOfAComment =
                "this is a Zascal Key " + Object.keys(end.children).length + 1;
            end.children[keyOfAComment] = val;
        } else {
            if (typeof val.value === "undefined") { continue; }
            end.children[val.name] = formatCSSParseNode(val);
        }
    }
    return end;
}
function formatCSSParseNode(node: any) {
    if (node["type"] === "attr") {
        let obj: any = {};
        obj[node.name] = node.value;
        return obj;
    } else if (node["type"] === "rule") {
        let numbers = Object.keys(node.value).filter(
            (x) => ["attributes", "children"].indexOf(x) === -1
        );
        let obj: any = {
            attributes: {},
            children: {},
        };
        for (let k of numbers) {
            let subNode = node.value[k];
            let result: any = formatCSSParseNode(subNode);
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
const theOrder: any = require("./order");
export function OrderCSS(css: any, orderType: string) {
    return;
    if (orderType === "importante") {
        css["attributes"] = sortAttributesImportante(css["attributes"]);
    } else if (orderType === "alphabetical") {
        css["attributes"] = sortAttributesAlfabeticly(css["attributes"]);
    }
    for (let childKey of Object.keys(css["children"])) {
        if (typeof css["children"][childKey] !== "string") {
            OrderCSS(css["children"][childKey], orderType);
        }
    }
}
function sortAttributesAlfabeticly(attributes: any) {
    let attributesKeys = Object.keys(attributes);
    if (attributesKeys.length < 2) {
        return attributes;
    }

    return attributesKeys.sort().reduce((acc: any, key) => {
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
export function JSONToText(json: any) {
    return JSON.stringify(json, null, 2);//CSSJSON.toCSS(json);
}
export function ReplaceFileContent(editor: TextEditor, newCSS: string) {

    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);

    const allDocumentRange = new Range(
        0,
        0,
        editor.document.lineCount - 1,
        lastLine.range.end.character + 1
    );

    editor.edit((editBuilder) => {
        editBuilder.replace(allDocumentRange, newCSS);
    });
}
//#endregion