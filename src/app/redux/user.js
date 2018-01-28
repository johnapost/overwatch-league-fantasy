// @flow

// Types
type UserState = {
  uid: string | null
}

type UserLogin = {
  type: 'LOGIN',
  uid: string
}

type UserLogout = {
  type: 'LOGOUT',
}

type UserAction = UserLogin | UserLogout

// Action Creators

export const userLogin = (uid: string): UserLogin => ({
  type: 'LOGIN', uid,
});

export const userLogout = (): UserLogout => ({
  type: 'LOGOUT',
});

// Reducer
const defaultState = { uid: null };

export default (
  state: UserState = defaultState,
  action: UserAction,
) => {
  switch (action.type) {
    case 'LOGIN': return { uid: action.uid };
    case 'LOGOUT': return defaultState;
    default: return state;
  }
};
