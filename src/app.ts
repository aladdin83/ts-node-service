import * as express from "express";
import * as mongoose from "mongoose";
import * as http from "http";

import registerRoutes from "./routes";
import expressConfig from "./config/express";
import config from "./config/enviroment";
import { HekaConfig } from "./@heka/core/config";
import { MongoError } from "mongodb";

class App {
  express: express.Application;
  config: HekaConfig;
  db: mongoose.Connection;
  server: http.Server;
  constructor() {
    this.config = config;
    this.express = express();
    this.server = http.createServer(this.express as any);
    this.initDatabaseConnection();

    expressConfig(this.express, this.config);
    registerRoutes(this.express);
  }

  initDatabaseConnection() {
    mongoose.connect(this.config.mongo.uri, {useNewUrlParser: true}, (err: MongoError) => {});
    this.db = mongoose.connection;
    this.db.on("error", this.dbConnectionError);
    this.db.on("open", this.dbConnectionSuccess);
  }

  dbConnectionError() {
    console.log("Error connecting to the database.");
  }

  dbConnectionSuccess() {

  }
}

// Express configuration

export default new App();