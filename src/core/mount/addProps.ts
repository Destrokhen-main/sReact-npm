import { validSingleProps } from "../linter/index";
import * as reactToCSS from "react-style-object-to-css";
import { typeOf } from "../helper/index";

export const addProps = function (tag: HTMLElement, props: object) {
  Object.keys(props).forEach((pr) => {
    if (pr === "src") {
      // check for function
      //let img = props[pr].default.split("/");
      tag.setAttribute(pr, props[pr].default);
    } else if (pr.startsWith("@")) {
      const name = pr.replace("@", "").trim();
      const func = props[pr].bind(window.sReact.sReactContext);
      tag.addEventListener(name, func);
    } else if (pr === "style") {
      // check for function
      let sheet: string;
      if (typeOf(props[pr]) === "string") {
        sheet = props[pr];
      } else {
        sheet = reactToCSS(props[pr]);
      }
      if (sheet.length !== 0) tag.setAttribute("style", sheet);
    } else if (typeOf(props[pr]) === "proxy") {
      if (props[pr].value !== "") {
        tag.setAttribute(pr, props[pr].value);
      }
      props[pr].parent.push({
        type: "props",
        value: tag,
        key: pr,
        node: this,
      });
    } else {
      if (typeOf(props[pr]) === "function") {
        const parsedProp = props[pr].bind(window.sReact.sReactContext)();
        validSingleProps(parsedProp, pr);
        tag.setAttribute(pr, parsedProp);
      } else {
        tag.setAttribute(pr, props[pr]);
      }
    }
  });
};
