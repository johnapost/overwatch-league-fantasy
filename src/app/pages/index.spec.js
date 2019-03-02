import React from "react";
import { shallow } from "enzyme";
import Index from "./index";

jest.mock("../components/filterableRosterTable");

describe("Index", () => {
  it("should render fine", () => {
    const wrapper = shallow(<Index />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
