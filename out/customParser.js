"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ATTRIBUTE_START_REGEX = /([^\{;]+);?|(\{[^}]*[}\s]*)/g; // /.*[a-z]*[\s]*{/gi;
class CSSAttribute {
    constructor(name) {
        this.name = name;
        this.properties = []; // example: [['color','red'],['z-index','9],['color','blue']]
        this.children = [];
    }
}
function ToJson(css) {
    return parseCSS(css);
}
exports.ToJson = ToJson;
const wish = [
    {
        parent: {
            name: "div"
        },
        children: [
            {
                parent: "#div",
                children: [],
                properties: {
                    'color': 'red',
                    '--var': "5px"
                }
            }
        ],
        properties: {
            "font-size": "18px",
            "border": " 1px solid black;",
        }
    }
];
function parseCSS(css) {
    let result = new Array();
    let lines = css.match(ATTRIBUTE_START_REGEX) || []; // Converts from div{color:red; top: 3px} to ['div', "color:red; top: 3px"]
    lines = lines.map(line => line.trim());
    for (let i = 0; i < lines.length; i++) {
        const attributeName = lines[i];
        if (attributeName.startsWith('@') && attributeName.endsWith(';')) {
            result.push(new CSSAttribute(attributeName));
            continue;
        }
        const newAttribute = new CSSAttribute(attributeName);
        parseContent(newAttribute, lines[i + 1]);
        result.push(newAttribute);
        i++;
    }
    return result;
}
function parseContent(attribute, content) {
    if (!content)
        return;
    const isNested = (content.split("{").length - 1) > 1;
    content = content.replace(/[{}]/g, '');
    if (isNested) {
        let properties = content.split(/\n/g)
            .filter(Boolean)
            .map(property => property
            .split(':')
            .map(cleanLine)
            .filter(Boolean))
            .filter(x => x.length > 0);
        attribute.properties = properties;
        attribute.children = [];
    }
    else {
        // Removing the big wrapper brackets
        content = content.replace("{", '').replace("}", '');
        attribute.children = parseCSS(content);
    }
}
function cleanLine(line) {
    return line.replace(/\t\r/g, '').trim();
}
/*
.box { #unique { color: red}}
.box {#unique { }}
.box {b { }}
*/
/* Notes:
- In properties get the comment above and add it
- @keyframe
- spaces and newlines before the selector
- split properties doesnt work properly in urls
*/ 
//# sourceMappingURL=customParser.js.map