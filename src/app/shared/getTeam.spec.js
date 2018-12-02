import getTeam from "./getTeam";

describe("getTeam", () => {
  it("should get a team", () => {
    expect(getTeam(4523)).toMatchSnapshot();
  });
});
