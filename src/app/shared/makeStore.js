// @flow

import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase';
import 'firebase/firestore';
import thunk from 'redux-thunk';
import { apiKey, authDomain, projectId } from '../../../env.json';

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

firebase.initializeApp(firebaseConfig);
firebase.firestore();

// Redux setup
const middleware = [thunk];
const reducers = combineReducers({
  firestore: firestoreReducer,
});

const composeEnhancers = (
  typeof window !== 'undefined' &&
  // eslint-disable-next-line no-underscore-dangle, no-undef
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  // eslint-disable-next-line no-underscore-dangle, no-undef
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
) || compose;

export default (state: Object) =>
  createStore(
    reducers,
    state,
    composeEnhancers(
      applyMiddleware(...middleware),
      reactReduxFirebase(firebase, rrfConfig),
      reduxFirestore(firebase),
    ),
  );
