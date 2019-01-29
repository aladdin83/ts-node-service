import * as express from "express";
import { HekaController } from "../../@heka/core/controller";
import Thing from "./model";

export class ThingsController extends HekaController {
  constructor() {
    super(Thing);
  }
}