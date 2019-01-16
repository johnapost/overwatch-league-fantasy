import React from "react";
import { shallow } from "enzyme";
import PlayerRow from "./playerRow";

const props = {
  attributes: {
    role: "offense"
  },
  headshot: "headshot.jpg",
  name: "Nina",
  onClick: jest.fn()
};

describe("PlayerRow", () => {
  const wrapper = shallow(<PlayerRow {...props} />);

  beforeEach(() => {
    props.onClick.mockClear();
  });

  it("should render data", () => {
    expect(wrapper.find(".headshot img").prop("src")).toBe(props.headshot);
  });

  it("should fire onClick when clicked", () => {
    expect(props.onClick).toHaveBeenCalledTimes(0);
    wrapper.simulate("click");
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
