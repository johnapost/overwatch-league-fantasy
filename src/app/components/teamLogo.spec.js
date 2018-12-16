import React from "react";
import { shallow } from "enzyme";
import TeamLogo from "./teamLogo";

const props = {
  team: "BOS"
};

describe("TeamLogo", () => {
  it("should render img tag with default props", () => {
    const wrapper = shallow(<TeamLogo {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should render img tag with passed props", () => {
    const wrapper = shallow(<TeamLogo {...props} height="16" width="16" />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
