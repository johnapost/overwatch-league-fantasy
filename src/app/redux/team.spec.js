import reducer, {
  defaultState,
  teamDraftSelect,
  teamDraftPlace,
  teamMoveSelect,
  teamMovePlace,
  teamSetDrafter
} from "./team";

describe("team", () => {
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

    it("teamSetDrafter should return action", () => {
      expect(teamSetDrafter(12345)).toMatchSnapshot();
    });
  });

  describe("reducer", () => {
    it("should return default state", () => {
      expect(reducer(undefined, { type: "" })).toMatchSnapshot();
    });

    it("should update state when drafting players", () => {
      const draftSelect = reducer(
        {
          ...defaultState,
          roster: {
            0: null,
            1: null
          }
        },
        teamDraftSelect(player)
      );
      expect(draftSelect).toMatchSnapshot();

      const draftPlace = reducer(draftSelect, teamDraftPlace(1));
      expect(draftPlace).toMatchSnapshot();
    });

    it("should update state when assigning drafters", () => {
      const firstDrafter = reducer(defaultState, teamSetDrafter(12345));
      expect(firstDrafter).toMatchSnapshot();

      const secondDrafter = reducer(firstDrafter, teamSetDrafter(54321));
      expect(secondDrafter).toMatchSnapshot();
    });

    it("should update state when moving players", () => {
      const moveSelect = reducer(
        {
          ...defaultState,
          roster: {
            0: player,
            1: null
          }
        },
        teamMoveSelect(0)
      );
      expect(moveSelect).toMatchSnapshot();

      const movePlace = reducer(moveSelect, teamMovePlace(1));
      expect(movePlace).toMatchSnapshot();
    });
  });
});
