import getStage from "./getStage";

describe("getState", () => {
  it("should retrieve current stage", () => {
    const stage = getStage(1550476700000, 2019);
    expect(stage).toBe(0);
  });

  it("should return null if stage not found", () => {
    const week = getStage(0, 2019);
    expect(week).toBe(null);
  });
});
