import { Application } from "express/lib/application";

export default function(app: Application) {
  app.use("/api/things", require("./api/thing"));
}