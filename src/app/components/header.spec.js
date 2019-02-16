import React from "react";
import { shallow } from "enzyme";
import Header from "./header";

const props = {
  title: "Draft"
};

describe("Header", () => {
  const wrapper = shallow(<Header {...props} />);

  it("should render a title", () => {
    expect(wrapper.text()).toMatch(props.title);
  });
});
