// @flow

import admin from "firebase-admin";
import { https } from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
admin.initializeApp();
const app = next({ dev, conf: { distDir: "next" } });
const handle = app.getRequestHandler();

export default https.onRequest((req, res) => {
  // eslint-disable-next-line no-console
  console.log(`File: ${req.originalUrl}`);
  const url = req.originalUrl.split("?").shift();
  switch (url) {
    // Handle auth email actions
    case "/auth": {
      const {
        query: { mode, oobCode }
      } = req;
      return app
        .prepare()
        .then(() => res.redirect(`/?mode=${mode}&oobCode=${oobCode}`));
    }
    default:
      return app.prepare().then(() => handle(req, res));
  }
});