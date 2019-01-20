import React from "react";
import { shallow } from "enzyme";
import Footer from "./footer";

describe("Footer", () => {
  const wrapper = shallow(<Footer />);

  it("should render", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
