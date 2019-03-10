import React from "react";
import { shallow } from "enzyme";
import { LeaguePanelComponent } from "./leaguePanel";

describe("LeaguePanel", () => {
  describe("component", () => {
    const props = {
      firebase: {},
      firestore: {},
      id: "abc123",
      league: {
        drafter: null,
        leagueUsers: ["qwer", "zxcv"],
        name: "Some League",
        ownerUser: "qwer",
        rosterSlots: ["flex", "flex"]
      },
      uid: "zxcv",
      users: [
        ["qwer", { displayName: "owner", userLeagues: ["abc123"] }],
        ["zxcv", { displayName: "user", userLeagues: ["abc123"] }]
      ]
    };

    it("should render fine", () => {
      const wrapper = shallow(<LeaguePanelComponent {...props} />);
      expect(wrapper.html()).toMatchSnapshot();
    });

    describe("when league owner", () => {
      describe("invite button", () => {
        it("should create invite link", () => {});

        it("should open modal if invite link already exists", () => {});
      });

      describe("modal", () => {
        it("should handle copying invite links", () => {});
      });
    });
  });
});
