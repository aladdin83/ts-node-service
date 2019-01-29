import * as express from "express";
import * as accepts from "accepts";
import * as escapeHtml from "escape-html";
import * as fs from "fs";
import * as path from "path";
import { inspect } from "util";
import config from "../../config/enviroment/";

exports.title = "Error";

export class ErrorHandlerOptions {
  log?: Function;

}
export class ErrorHandlerComponent {
  constructor(options: ErrorHandlerOptions = {}) {}

  handleError() {
    return (err: Error, req: express.Request, res: express.Response, next: Function) => {
      console.log("IT'S ME THE HANDLER");
      // default status code to 500
      if (res.statusCode < 400) {
        res.statusCode = 500;
      }

      // log the error
      const str = this.stringifyError(err);
      if (this.log) {
        setImmediate (this.log, err, str, req, res);
      }

      const accept = accepts(req);
      const type = accept.type("html", "json", "text");

      res.setHeader("X-Content-Type-Options", "nosniff");

      if (type === "html") {
        const isInspect = !err.stack && String(err) === Object.prototype.toString.call(err);
        const errorHtml = !isInspect
          ? this.escapeHtmlBlock(str.split("\n", 1)[0] || "Error")
          : "Error";
        const stack = !isInspect
          ? String(str).split("\n").slice(1)
          : [str];
        const stackHtml = stack
          .map((v) => { return `<li>${this.escapeHtmlBlock(v)}</li>`; })
          .join("");
        const TEMPLATE = fs.readFileSync(path.join(__dirname, "../../templates/error/error.html"), "utf8");
        const STYLESHEET = fs.readFileSync(path.join(__dirname, "../../templates/error/style.css"), "utf8");
        const body = TEMPLATE
          .replace("<!-- style -->", `<style>${STYLESHEET}</style>`)
          .replace("<!-- stack -->", stackHtml)
          .replace("<!-- title -->", this.escapeHtmlBlock(exports.title))
          .replace("<!-- statusCode -->", res.statusCode.toString())
          .replace("<!-- error -->", errorHtml);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(body);
      } else if (type === "json") {
        const error: any = {message: err.message, stack: err.stack};
        for (const prop in err) error[prop] = (err as any)[prop];
        const json = JSON.stringify({error: error}, undefined, 2);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(json);
      } else {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(str);
      }
    };
  }

  private stringifyError(err: Error): string {
    const stack = err.stack;
    if (stack) {
      return stack;
    }
    const str = String(err);
    return str === Object.prototype.toString.call(err)
      ? inspect(err)
      : str;
  }
  /**
   * Escape a block of HTML, preserving whitespace
   * @param str Html String
   */
  private escapeHtmlBlock(str: string): string {
    const DOUBLE_SPACE_REGEXP = /\x20{2}/g;
    const NEW_LINE_REGEXP = /\n/g;

    return escapeHtml(str)
      .replace(DOUBLE_SPACE_REGEXP, " &nbsp;")
      .replace(NEW_LINE_REGEXP, "<br>");
  }

  log (err: Error, str: string): void {
    console.error(str || err.stack);
  }
}