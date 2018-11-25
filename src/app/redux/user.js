// @flow

// Types
type UserState = {
  uid: string | null,
  displayName: string | null
};

type UserLogin = {
  type: "LOGIN",
  uid: string
};

type UserLogout = {
  type: "LOGOUT"
};

type UserSetName = {
  type: "@@reactReduxFirebase/SET_PROFILE",
  profile: {
    displayName: string
  }
};

type UserAction = UserLogin | UserLogout | UserSetName;

// Action Creators
export const userLogin = (uid: string): UserLogin => ({
  type: "LOGIN",
  uid
});

export const userLogout = (): UserLogout => ({
  type: "LOGOUT"
});

// Reducer
export const defaultState: UserState = { uid: null, displayName: null };

export default (state: UserState = defaultState, action: UserAction) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, uid: action.uid };
    case "LOGOUT":
      return defaultState;
    case "@@reactReduxFirebase/SET_PROFILE":
      return { ...state, displayName: action.profile.displayName };
    default:
      return state;
  }
};
