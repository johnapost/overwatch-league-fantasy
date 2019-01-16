import calcScore from "./calcScore";

// Libero season 1, regular season stats
const stats = {
  deaths_avg_per_10m: 5.590529289577374,
  eliminations_avg_per_10m: 16.189045320910616,
  final_blows_avg_per_10m: 8.869680082959734,
  healing_avg_per_10m: 301.62537214292485,
  hero_damage_avg_per_10m: 7851.6346402920535,
  time_played_total: 127715.9930690527,
  ultimates_earned_avg_per_10m: 3.8898808838403913
};

describe("calcScore", () => {
  it("should return a score for offense", () => {
    expect(typeof calcScore(stats, "offense")).toBe("number");
  });

  it("should return a score for tank", () => {
    expect(typeof calcScore(stats, "tank")).toBe("number");
  });

  it("should return a score for support", () => {
    expect(typeof calcScore(stats, "support")).toBe("number");
  });

  it("should return a score for flex", () => {
    expect(typeof calcScore(stats, "flex")).toBe("number");
  });
});
