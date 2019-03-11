import React from "react";
import { shallow } from "enzyme";
import { LoginFormComponent } from "./loginForm";
import hasErrors from "../shared/hasErrors";

jest.mock("../shared/hasErrors");

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hasErrors.mockImplementation(() => false);
  });

  describe("component", () => {
    const props = {
      disabled: false,
      form: {
        getFieldDecorator: jest.fn(() => jest.fn(component => component)),
        getFieldsError: jest.fn()
      },
      router: { query: { email: "fdsa@asdf.com" } }
    };

    it("should render fine", () => {
      const wrapper = shallow(<LoginFormComponent {...props} />);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
