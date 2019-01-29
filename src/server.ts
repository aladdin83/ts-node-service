
const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

import app from "./app";

/**
 * Start Express server.
 */
const server = app.express.listen(app.config.port, () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.config.port,
    app.config.env
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
