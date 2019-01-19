import React from "react";
import { shallow } from "enzyme";
import { Modal } from "antd";
import { LeaguesListComponent, mapStateToProps } from "./leaguesList";

const props = {
  leagues: {},
  user: {
    displayName: "John again"
  }
};

describe("FindLeague", () => {
  describe("component", () => {
    const wrapper = shallow(<LeaguesListComponent {...props} />);

    describe("with no leagues", () => {
      it("should render Modal with user displayName", () => {
        expect(wrapper.find(Modal).length).toBe(1);
        expect(wrapper.find(Modal).prop("title")).toMatch(
          props.user.displayName
        );
      });
    });

    describe("with leagues", () => {
      xit("should render a list of leagues", () => {});
    });
  });

  describe("mapStateToProps", () => {
    it("should assign user data", () => {
      expect(
        mapStateToProps({
          firestore: { data: {} },
          user: { displayName: "user", uid: "abc123" }
        })
      ).toMatchSnapshot();
    });

    it("should filter and map leagues", () => {
      expect(
        mapStateToProps({
          firestore: {
            data: {
              leagues: {
                1: { leagueUsers: "abc123" },
                2: { leagueUsers: "cba321" },
                3: { leagueUsers: "abc123" }
              }
            }
          },
          user: { uid: "abc123" }
        })
      ).toMatchSnapshot();
    });
  });
});
