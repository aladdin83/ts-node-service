import * as express from "express";
import * as mongoose from "mongoose";
import * as http from "http";
import { CronJob } from "cron";
import * as socketio from "socket.io";

import registerRoutes from "./routes";
import expressConfig from "./config/express";
import config from "./config/environment/";
import { HekaConfig } from "./@heka/core/config";
import { MongoError } from "mongodb";
import { registerSockets } from "./socketio";

class App {
  express: express.Application;
  config: HekaConfig;
  db: mongoose.Connection;
  server: http.Server;
  cronJobs: any;
  socketioServer: SocketIO.Server;
  constructor() {
    this.config = config;
    this.express = express();
    this.server = http.createServer(this.express as any);
    this.db = mongoose.connection;
    this.db.on("error", this.dbConnectionError);
    this.db.on("open", this.dbConnectionSuccess);
  }

  init(){
    expressConfig(this.express, this.config);
    registerRoutes(this.express);
    this.socketioServer = socketio(this.server);
    registerSockets(this.socketioServer);
    this.connectDatabase();
    this.startAllCronJobs();
  }

  connectDatabase(this: App) {
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    };
    if (!this.config && this.config.mongo && this.config.mongo.uri) throw new Error("database uri is not set");
    const mongoUri = this.config.mongo.uri || "";
    mongoose.connect(mongoUri, options, (err: MongoError) => {
      if (err) {this.dbConnectionError(); }
      else {
        this.dbConnectionSuccess();
      }
    });
  }

  dbConnectionError() {
    console.log("Error connecting to the database.");
  }

  dbConnectionSuccess() {

  }

  startAllCronJobs() {
    for (const key in this.cronJobs) {
      (this.cronJobs[key] as CronJob).start();
    }
  }
}

// Express configuration

export default new App();