// @flow

// Types
type UserState = {
  uid: string | null,
  displayName: string | null
}

type UserLogin = {
  type: 'LOGIN',
  uid: string
}

type UserLogout = {
  type: 'LOGOUT',
}

type UserSetName = {
  type: 'SET_NAME',
  displayName: string
}

type UserAction = UserLogin | UserLogout | UserSetName

// Action Creators

export const userLogin = (uid: string): UserLogin => ({
  type: 'LOGIN', uid,
});

export const userLogout = (): UserLogout => ({
  type: 'LOGOUT',
});

export const userSetName = (displayName: string): UserSetName => ({
  type: 'SET_NAME', displayName,
});

// Reducer
const defaultState = { uid: null, displayName: null };

export default (
  state: UserState = defaultState,
  action: UserAction,
) => {
  switch (action.type) {
    case 'LOGIN': return { ...state, uid: action.uid };
    case 'LOGOUT': return defaultState;
    case 'SET_NAME': return { ...state, displayName: action.displayName };
    default: return state;
  }
};
