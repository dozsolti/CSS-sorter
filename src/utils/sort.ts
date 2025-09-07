import postcss from "postcss";
import cssDeclarationSorter from "css-declaration-sorter";
import syntaxLess from "postcss-less";
import syntaxScss from "postcss-scss";
import syntaxHTML from "postcss-html";
import { OrderType, LanguageId } from "../types";

const SYNTAXES: Record<LanguageId, any> = {
  less: syntaxLess,
  scss: syntaxScss,
  
  html: syntaxHTML({ scss: syntaxScss, less: syntaxLess }),
  css: undefined, // use default CSS parser
};

export async function sort(
  text: string,
  orderType: OrderType,
  language: LanguageId = "css"
): Promise<string> {
  const order = orderType === "importance" ? "concentric-css" : "alphabetical";
  const syntax = SYNTAXES[language];

  const result = await postcss([
    cssDeclarationSorter({
      order,
      keepOverrides: true,
    }),
  ]).process(text, {
    from: undefined,
    syntax,
  });

  return language === "html" ? result.content : result.css;
}
