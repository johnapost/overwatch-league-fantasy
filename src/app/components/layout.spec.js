import React from "react";
import { shallow } from "enzyme";
import Layout from "./layout";

describe("Layout", () => {
  it("should render children", () => {
    const children = [<div key={0} />, <div key={1} />, <div key={2} />];
    const wrapper = shallow(<Layout>{children}</Layout>);
    expect(wrapper.find("main").find("div").length).toBe(3);
  });

  it("should render title", () => {
    const wrapper = shallow(<Layout title="Title" />);
    expect(wrapper.find("title").text()).toBe("Title");
  });
});
