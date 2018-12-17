import React from "react";
import { shallow } from "enzyme";
import Player from "./player";

const props = {
  attributes: {
    role: "offense"
  },
  headshot: "headshot.jpg",
  name: "Nina",
  team: {
    abbreviatedName: "DAL",
    primaryColor: "ffffff"
  },
  onClick: jest.fn(),
  role: undefined
};

describe("Player", () => {
  const wrapper = shallow(<Player {...props} />);

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
