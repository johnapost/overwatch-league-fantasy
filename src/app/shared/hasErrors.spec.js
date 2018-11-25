import hasErrors from "./hasErrors";

describe("hasErrors", () => {
  it("should return true if errors exist", () => {
    expect(
      hasErrors({ email: ["email is not a valid email"], password: undefined })
    ).toBe(true);
  });

  it("should return false if no errors exist", () => {
    expect(hasErrors({ email: undefined, password: undefined })).toBe(false);
  });
});
