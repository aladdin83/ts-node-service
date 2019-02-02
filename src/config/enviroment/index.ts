import * as path from "path";

const all: HekaConfig = {
  env: process.env.NODE_ENV,
  // root path of server
  root: path.normalize(`${__dirname}/../../..`),
  // Server port
  port: parseInt(process.env.PORT) || 3000,
  // Server IP
  ip: process.env.IP || "0.0.0.0",
  // Should seed DB
  seedDB: false,
  secrets: {
    session: "session-secret"
  },
  session: {
    lifetime: 60 * 60 * 5
  },
  mongo: {
    useNewUrlParser: true
  }
};

import shared from "./shared";
import development from "./development";
import production from "./production";
import test from "./test";
import { HekaConfig } from "../../@heka/core/config";

const config: HekaConfig = {};
Object.assign(config, all, shared);

switch (process.env.NODE_ENV || "development") {
  case "development":
    Object.assign(config, development);
    break;
  case "production":
    Object.assign(config, production);
    break;
  case "test":
    Object.assign(config, test);
    break;
}

export default config;