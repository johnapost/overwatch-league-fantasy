import next from "next";
import nextApp from "./nextApp";

jest.mock("firebase-functions", () => ({ https: { onRequest: fn => fn } }));
jest.mock("next");

describe("nextApp", () => {
  const handlerSpy = jest.fn();
  const redirectSpy = jest.fn();

  beforeEach(() => {
    next.mockImplementation(() => ({
      getRequestHandler: () => handlerSpy,
      prepare: () => ({
        then: fn => fn()
      })
    }));
    handlerSpy.mockReset();
    redirectSpy.mockReset();
  });

  it("should handle app routes", () => {
    const req = {
      originalUrl: "/"
    };
    nextApp(req, null);
    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(handlerSpy).toHaveBeenCalledWith(req, null);
  });
});
