---
to: src/api/<%= name.toLowerCase() %>/controller.ts
---
import * as express from "express";
import { HekaController } from "../../@heka/core/controller";
import model from "./model";

export class <%= h.inflection.capitalize(h.inflection.pluralize(name)) %>Controller extends HekaController {
  constructor() {
    super(model);
  }
}

