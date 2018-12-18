import { firestore } from "firebase-admin";
import { get } from "axios";
import syncPlayers from "./syncPlayers";

jest.mock("firebase-functions", () => ({ https: { onRequest: fn => fn } }));
jest.mock("firebase-admin", () => ({ firestore: jest.fn() }));
jest.mock("axios", () => ({ get: jest.fn() }));

describe("syncPlayers", () => {
  const sendSpy = jest.fn();
  const consoleErrorSpy = jest.fn();

  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleErrorSpy;
    sendSpy.mockReset();
    consoleErrorSpy.mockReset();
  });

  it("should send errors", async () => {
    firestore.mockImplementation(() => ({ firestore: jest.fn() }));
    get.mockImplementation(() => ({ data: { data: null } }));
    const req = {};
    const res = {
      send: sendSpy
    };
    await syncPlayers(req, res);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
