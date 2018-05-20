import { initializeApp } from "firebase-admin";
import { https, config } from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
initializeApp(config().firebase);
const app = next({ dev, conf: { distDir: "next" } });
const handle = app.getRequestHandler();

const nextApp = https.onRequest((req, res) => {
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

// eslint-disable-next-line import/prefer-default-export
export { nextApp };
