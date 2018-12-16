// @flow

import { https } from "firebase-functions";

export default https.onRequest((req, res) => res.send("Yay"));
