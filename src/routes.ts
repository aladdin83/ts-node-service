import { Application } from "express/lib/application";

export default function(app: Application) {
  app.use("/api/things", require("./api/thing"));
  app.use("/api/users", require("./api/user"));
  app.use("/api/article", require("./api/article"));
  app.use("/api/section", require("./api/section"));
}