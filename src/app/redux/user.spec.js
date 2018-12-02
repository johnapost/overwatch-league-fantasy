import reducer, { defaultState, userLogin, userLogout } from "./user";

describe("user", () => {
  describe("action creators", () => {
    it("userLogin should return action", () => {
      expect(userLogin("123")).toMatchSnapshot();
    });

    it("userLogout should return action", () => {
      expect(userLogout()).toMatchSnapshot();
    });
  });

  describe("reducer", () => {
    it("should return default state", () => {
      expect(reducer(undefined, { type: "" })).toMatchSnapshot();
    });

    it("should update user when logging in and out", () => {
      const logIn = reducer(defaultState, userLogin("123"));
      expect(logIn).toMatchSnapshot();

      const setProfile = reducer(logIn, {
        type: "@@reactReduxFirebase/SET_PROFILE",
        profile: { displayName: "testUser" }
      });
      expect(setProfile).toMatchSnapshot();

      const logOut = reducer(setProfile, userLogout());
      expect(logOut).toMatchSnapshot();
    });
  });
});
