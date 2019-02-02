import * as express from "express";
import { HekaController } from "../../@heka/core/controller";
import model from "./model";

export class UsersController extends HekaController {
  constructor() {
    super(model);
  }
}

