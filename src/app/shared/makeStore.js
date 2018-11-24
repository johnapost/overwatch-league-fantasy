// @flow

import { combineReducers, compose, createStore } from "redux";
import { reactReduxFirebase } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import { config } from "firebase-functions";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import user from "../redux/user";

// Firebase setup
const rrfConfig = { userProfile: "users", useFirestoreForProfile: true };

// Redux setup
const reducers = combineReducers({
  firestore: firestoreReducer,
  user
});

let enhancers;

// Client Only
if (typeof window !== "undefined") {
  if (!firebase.apps.length) {
    firebase.initializeApp(config().firebase);
  }
  const firestore = firebase.firestore();
  firestore.settings({ timestampsInSnapshots: true });

  const composeFn =
    // eslint-disable-next-line no-underscore-dangle
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})) ||
    compose;

  // Only make the firebase connection on the client side
  enhancers = composeFn(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
  );
}

export default (state: Object) => createStore(reducers, state, enhancers);
