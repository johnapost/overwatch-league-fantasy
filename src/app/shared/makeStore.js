// @flow

import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase';
import 'firebase/firestore';
import thunk from 'redux-thunk';
import { apiKey, authDomain, projectId } from '../secrets';

// Firebase setup
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
};

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

// Redux setup
const middleware = [thunk];
const reducers = combineReducers({
  firestore: firestoreReducer,
});

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

  enhancers = composeFn(
    applyMiddleware(...middleware),
    // Only make the firebase connection on the client side
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase),
  );

// Server Only
} else {
  enhancers = applyMiddleware(...middleware);
}

export default (state: Object) =>
  createStore(
    reducers,
    state,
    enhancers,
  );
