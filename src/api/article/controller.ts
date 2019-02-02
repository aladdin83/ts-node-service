import * as express from "express";
import { HekaController } from "../../@heka/core/controller";
import model from "./model";

export class ArticlesController extends HekaController {
  constructor() {
    super(model);
  }
}

