import React from "react";
import { shallow } from "enzyme";
import { AuthBarComponent } from "./authBar";
import ProfileMenu from "./profileMenu";

jest.mock("./loginForm");
jest.mock("./signUpForm");
jest.mock("./profileMenu");

describe("AuthBar", () => {
  describe("component", () => {
    const props = {
      firebase: {
        firestore: {}
      },
      firestore: {}
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should render fine", () => {
      const wrapper = shallow(<AuthBarComponent {...props} />);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should not display ProfileMenu", () => {
      const wrapper = shallow(<AuthBarComponent {...props} />);
      expect(wrapper.find(ProfileMenu).length).toBe(0);
    });

    describe("when logged in", () => {
      it("should display ProfileMenu", () => {
        const wrapper = shallow(<AuthBarComponent {...props} />);
        wrapper.instance().setState({ loggedIn: true });
        expect(wrapper.find(ProfileMenu).length).toBe(1);
      });
    });
  });
});
