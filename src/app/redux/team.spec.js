import reducer, {
  defaultState,
  teamSetSlots,
  teamDraftSelect,
  teamDraftPlace,
  teamMoveSelect,
  teamMovePlace
} from "./team";

describe("team", () => {
  const slots = [
    "Offense",
    "Offense",
    "Tank",
    "Tank",
    "Support",
    "Support",
    "Flex",
    "Flex"
  ];
  const player = {
    givenName: "Nina",
    familyName: "Williams",
    headshot: "https://url.url/nina-williams.jpg",
    name: "OWLName",
    nationality: "FI",
    id: "1234",
    teamId: 4523
  };

  describe("action creators", () => {
    it("teamSetSlots should return action", () => {
      expect(teamSetSlots(slots)).toMatchSnapshot();
    });

    it("teamDraftSelect should return action", () => {
      expect(teamDraftSelect(player)).toMatchSnapshot();
    });

    it("teamDraftPlace should return action", () => {
      expect(teamDraftPlace(0)).toMatchSnapshot();
    });

    it("teamMoveSelect should return action", () => {
      expect(teamMoveSelect(0)).toMatchSnapshot();
    });

    it("teamMovePlace should return action", () => {
      expect(teamMovePlace(1)).toMatchSnapshot();
    });
  });

  describe("reducer", () => {
    it("should return default state", () => {
      expect(reducer(undefined, { type: "" })).toMatchSnapshot();
    });

    it("should update state when drafting players", () => {
      const setSlots = reducer(defaultState, teamSetSlots(slots));
      expect(setSlots).toMatchSnapshot();

      const draftSelect = reducer(setSlots, teamDraftSelect(player));
      expect(draftSelect).toMatchSnapshot();

      const draftPlace = reducer(draftSelect, teamDraftPlace(1));
      expect(draftPlace).toMatchSnapshot();
    });

    xit("should update state when moving players", () => {});
  });
});
