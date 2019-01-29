import * as express from "express";
import * as morgan from "morgan";
import * as compression from "compression";
import * as bodyparser from "body-parser";
import * as methodOverride from "method-override";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import * as moongose from "mongoose";
import * as session from "express-session";


import { applyOperation } from "fast-json-patch";
import { HekaConfig } from "../@heka/core/config";
import { ErrorHandlerComponent } from "../components/error-handler";

import app from "../app";

const MongoDBStore = require("connect-mongodb-session")(session);
const errorHandler = new ErrorHandlerComponent();

export default function(app: express.Application, config: HekaConfig) {
  // Setup http requests logging
  app.use(morgan("dev"));

  app.use(compression());
  app.use(bodyparser.urlencoded({extended: false}));
  app.use(bodyparser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist session with MongoStore
/*
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoDBStore({
      uri: config.mongo.uri,
      collection: 'sessions'
    })
  }));
*/
  app.use(errorHandler.handleError());

}