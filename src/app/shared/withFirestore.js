// @flow

import { firestoreConnect } from 'react-redux-firebase';

// Connect to firestore with client only
export default (query?: Object[] | Object => Object[]) =>
  (typeof window !== 'undefined' ? firestoreConnect(query) : (arg: any) => arg);
