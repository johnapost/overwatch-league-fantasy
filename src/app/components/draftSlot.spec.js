import React from "react";
import { shallow } from "enzyme";
import DraftSlot from "./draftSlot";

const props = {
  onClick: jest.fn(),
  role: "offense"
};

describe("DraftSlot", () => {
  const wrapper = shallow(<DraftSlot {...props} />);

  beforeEach(() => {
    props.onClick.mockClear();
  });

  it("should render role", () => {
    expect(wrapper.find(".role").contains(props.role)).toBe(true);
  });

  it("should fire onClick when clicked", () => {
    expect(props.onClick).toHaveBeenCalledTimes(0);
    wrapper.simulate("click");
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
