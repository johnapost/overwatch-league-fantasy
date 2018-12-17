import React from "react";
import { shallow } from "enzyme";
import { TeamComponent, mapStateToProps } from "./team";
import DraftSlot from "./draftSlot";
import Player from "./player";

const props = {
  drafting: false,
  roster: {
    0: {
      attributes: {
        role: "offense"
      },
      headshot: "headshot.jpg",
      id: "999",
      name: "Nina",
      teamId: 4523,
      onClick: jest.fn(),
      role: undefined
    }
  },
  rosterSlots: {
    0: "offense",
    1: "tank"
  },
  draftPlace: () => {}
};

describe("Team", () => {
  describe("component", () => {
    const wrapper = shallow(<TeamComponent {...props} />);

    it("should render a DraftSlot component", () => {
      expect(wrapper.find(DraftSlot).length).toBe(1);
    });

    it("should render a Player component", () => {
      expect(wrapper.find(Player).length).toBe(1);
    });
  });

  describe("mapStateToProps", () => {
    const store = {
      firestore: {
        data: {
          leagues: {
            first: {
              drafter: "123"
            }
          }
        }
      },
      team: {
        drafter: null,
        selectedPlayer: null,
        roster: {}
      },
      user: {
        uid: "123"
      }
    };

    it("should check if currently drafting", () => {
      expect(mapStateToProps(store)).toMatchSnapshot();
    });

    it("should assign rosterSlots", () => {
      expect(
        mapStateToProps({
          ...store,
          rosterSlots: {
            0: "offense",
            1: "tank"
          }
        })
      ).toMatchSnapshot();
    });
  });
});
