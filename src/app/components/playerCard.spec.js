import React from "react";
import { shallow } from "enzyme";
import PlayerCard from "./playerCard";

const props = {
  attributes: {
    role: "offense"
  },
  headshot: "headshot.jpg",
  name: "Nina",
  onClick: jest.fn()
};

describe("PlayerCard", () => {
  const wrapper = shallow(<PlayerCard {...props} />);

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
