import React from "react";
import { shallow } from "enzyme";
import { Modal } from "antd";
import { FindLeagueComponent, mapStateToProps } from "./findLeague";

const props = {
  displayName: "John again"
};

describe("FindLeague", () => {
  describe("component", () => {
    const wrapper = shallow(<FindLeagueComponent {...props} />);

    it("should render user displayName", () => {
      expect(wrapper.find(Modal).prop("title")).toMatch(props.displayName);
    });
  });

  describe("mapStateToProps", () => {
    it("should assign displayName", () => {
      expect(
        mapStateToProps({ user: { displayName: "user" } })
      ).toMatchSnapshot();
    });
  });
});
