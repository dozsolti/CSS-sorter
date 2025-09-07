"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = sort;
const postcss_1 = __importDefault(require("postcss"));
const css_declaration_sorter_1 = __importDefault(require("css-declaration-sorter"));
const postcss_less_1 = __importDefault(require("postcss-less"));
const postcss_scss_1 = __importDefault(require("postcss-scss"));
const postcss_html_1 = __importDefault(require("postcss-html"));
const SYNTAXES = {
    less: postcss_less_1.default,
    scss: postcss_scss_1.default,
    html: (0, postcss_html_1.default)({ scss: postcss_scss_1.default, less: postcss_less_1.default }),
    css: undefined, // use default CSS parser
};
async function sort(text, orderType, language = "css") {
    const order = orderType === "importance" ? "concentric-css" : "alphabetical";
    const syntax = SYNTAXES[language];
    const result = await (0, postcss_1.default)([
        (0, css_declaration_sorter_1.default)({
            order,
            keepOverrides: true,
        }),
    ]).process(text, {
        from: undefined,
        syntax,
    });
    return language === "html" ? result.content : result.css;
}
//# sourceMappingURL=sort.js.map