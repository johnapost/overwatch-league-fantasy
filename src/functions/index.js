import { https } from 'firebase-functions';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: 'next' } });
const handle = app.getRequestHandler();

const nextApp = https.onRequest((req, res) => {
  // eslint-disable-next-line no-console
  console.log(`File: ${req.originalUrl}`);
  switch (req.originalUrl) {
    // Handle auth email actions
    case '/auth': {
      const { query: { mode, oobCode } } = req;
      return app.prepare().then(() =>
        handle(req, res, '/login', { mode, oobCode }));
    }
    default:
      return app.prepare().then(() => handle(req, res));
  }
});

// eslint-disable-next-line import/prefer-default-export
export { nextApp };
