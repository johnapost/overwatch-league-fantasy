// @flow

import { combineReducers, compose, createStore } from "redux";
import { reactReduxFirebase } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import user from "../redux/user";
import team from "../redux/team";
import { apiKey, authDomain, projectId } from "../secrets.json";

import type { TeamState } from "../redux/team";
import type { UserState } from "../redux/user";

export type StoreState = {
  firestore: Object,
  team: TeamState,
  user: UserState
};

// Firebase setup
const firebaseConfig = { apiKey, authDomain, projectId };
const rrfConfig = { userProfile: "users", useFirestoreForProfile: true };

// Redux setup
const reducers = combineReducers({
  firestore: firestoreReducer,
  team,
  user
});

let enhancers;

// Client Only
if (typeof window !== "undefined") {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
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
