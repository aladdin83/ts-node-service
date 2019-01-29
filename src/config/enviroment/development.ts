import { HekaConfig } from "../../@heka/core/config";

const config: HekaConfig = {
  mongo: {
    uri: `mongodb://localhost:27017/ts-node-service`,
    useNewUrlParser: true
  }
};

export default config;