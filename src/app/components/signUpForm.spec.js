import React from "react";
import { shallow } from "enzyme";
import { SignUpFormComponent } from "./signUpForm";
import hasErrors from "../shared/hasErrors";

jest.mock("../shared/hasErrors");

describe("SignUpForm", () => {
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
      }
    };

    it("should render fine", () => {
      const wrapper = shallow(<SignUpFormComponent {...props} />);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
