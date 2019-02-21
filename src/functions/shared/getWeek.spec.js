import getWeek from "./getWeek";

describe("getWeek", () => {
  it("should return current week", () => {
    const week = getWeek(1550476700000, 2019, 0);
    expect(week).toBe(0);
  });

  it("should return null if week not found", () => {
    const week = getWeek(0, 2019, 0);
    expect(week).toBe(null);
  });
});
