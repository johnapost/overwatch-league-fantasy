import React from "react";
import { shallow } from "enzyme";
import Index from "./index";

describe("Index", () => {
  it("should render fine", () => {
    const wrapper = shallow(<Index />);
    expect(wrapper).toMatchSnapshot();
  });
});
