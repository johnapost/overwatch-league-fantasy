import React from "react";
import { shallow } from "enzyme";
import { Modal } from "antd";
import clipboardCopy from "clipboard-copy";
import { LeaguePanelComponent } from "./leaguePanel";

jest.mock("uuid/v4", () => () => "hhh4");
jest.mock("clipboard-copy");

describe("LeaguePanel", () => {
  describe("component", () => {
    const setSpy = jest.fn();
    const props = {
      firebase: {
        firestore: {
          FieldValue: {
            serverTimestamp: jest.fn()
          }
        }
      },
      firestore: {
        set: setSpy
      },
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

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should render fine", () => {
      const wrapper = shallow(<LeaguePanelComponent {...props} />);
      expect(wrapper.html()).toMatchSnapshot();
    });

    describe("when league owner", () => {
      const ownerProps = {
        ...props,
        uid: "qwer"
      };

      const findVisibleModal = wrapper =>
        wrapper.find(Modal).filter({ visible: true });

      describe("invite button", () => {
        it("should create invite link", async () => {
          const wrapper = shallow(<LeaguePanelComponent {...ownerProps} />);
          const inviteButton = wrapper.find({ name: "invite-button" });
          await inviteButton.simulate("click");
          expect(setSpy).toHaveBeenCalledTimes(1);
          expect(wrapper.state("latestInviteLink")).toBe("hhh4");
          expect(findVisibleModal(wrapper).length).toBe(1);
        });

        it("should open modal if invite link already exists", async () => {
          const wrapper = shallow(<LeaguePanelComponent {...ownerProps} />);
          wrapper.instance().setState({ latestInviteLink: "hhh4" });
          const inviteButton = wrapper.find({ name: "invite-button" });
          expect(findVisibleModal(wrapper).length).toBe(0);
          await inviteButton.simulate("click");
          expect(setSpy).not.toHaveBeenCalled();
          expect(findVisibleModal(wrapper).length).toBe(1);
        });
      });

      describe("modal", () => {
        it("should handle copying invite links", () => {
          const wrapper = shallow(<LeaguePanelComponent {...ownerProps} />);
          wrapper
            .instance()
            .setState({ latestInviteLink: "hhh4", modalVisible: true });
          wrapper.find({ name: "copy-button" }).simulate("click");
          expect(clipboardCopy).toHaveBeenCalledWith(
            "http://localhost/invite/hhh4"
          );
        });

        it("should open and close", () => {
          const wrapper = shallow(<LeaguePanelComponent {...ownerProps} />);
          wrapper.instance().setState({ latestInviteLink: "hhh4" });
          expect(findVisibleModal(wrapper).length).toBe(0);
          wrapper.find({ name: "invite-button" }).simulate("click");
          expect(findVisibleModal(wrapper).length).toBe(1);
          findVisibleModal(wrapper).prop("onCancel")();
          expect(findVisibleModal(wrapper).length).toBe(0);
        });
      });
    });
  });
});
