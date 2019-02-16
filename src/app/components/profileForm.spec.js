import React from "react";
import { shallow } from "enzyme";
import { Form, Button } from "antd";
import { ProfileForm } from "./profileForm";
import hasErrors from "../shared/hasErrors";

jest.mock("../shared/hasErrors");

const validateFields = jest.fn();
const hideProfileModal = jest.fn();

const props = {
  displayName: "user",
  firestore: {},
  form: {
    getFieldDecorator: jest.fn(() => jest.fn()),
    getFieldsError: jest.fn(),
    validateFields
  },
  hideProfileModal,
  uid: "abc123"
};

describe("ProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hasErrors.mockImplementation(() => false);
  });

  it("should not be submittable if there are validation errors", () => {
    hasErrors.mockImplementation(() => true);
    const wrapper = shallow(<ProfileForm {...props} />);
    const button = wrapper.find(Button);
    expect(button.prop("disabled")).toBe(true);
  });

  it("should finish submitting if an error occurs", () => {
    validateFields.mockImplementation(fn => fn({}, {}));
    const wrapper = shallow(<ProfileForm {...props} />);
    const form = wrapper.find(Form);
    form.simulate("submit", { preventDefault: jest.fn() });
    expect(hideProfileModal).toHaveBeenCalledTimes(1);
  });
});
