// @flow

import { combineReducers, compose, createStore } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase';
import 'firebase/firestore';
import { apiKey, authDomain, projectId } from '../secrets';

// Firebase setup
const firebaseConfig = { apiKey, authDomain, projectId };
const rrfConfig = { userProfile: 'users', useFirestoreForProfile: true };

// Redux setup
const reducers = combineReducers({ firestore: firestoreReducer });

let enhancers;

// Client Only
if (typeof window !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  firebase.firestore();

  const composeFn = (
    // eslint-disable-next-line no-underscore-dangle, no-undef
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    // eslint-disable-next-line no-underscore-dangle, no-undef
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  ) || compose;

  // Only make the firebase connection on the client side
  enhancers = composeFn(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase),
  );
}

export default (state: Object) =>
  createStore(
    reducers,
    state,
    enhancers,
  );
