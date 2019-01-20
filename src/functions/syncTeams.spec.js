import { firestore } from "firebase-admin";
import { get } from "axios";
import syncTeams from "./syncTeams";

jest.mock("firebase-functions", () => ({ https: { onRequest: fn => fn } }));
jest.mock("firebase-admin", () => ({ firestore: jest.fn() }));
jest.mock("axios", () => ({ get: jest.fn() }));

describe("syncTeams", () => {
  const sendSpy = jest.fn();
  const setSpy = jest.fn();
  const consoleErrorSpy = jest.fn();

  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleErrorSpy;
    sendSpy.mockReset();
    setSpy.mockReset();
    consoleErrorSpy.mockReset();
  });

  fit("should sync player data", async () => {
    firestore.mockImplementation(() => ({
      batch: () => ({ commit: jest.fn(), set: setSpy }),
      collection: () => ({ doc: jest.fn() })
    }));
    get.mockImplementation(() => ({
      data: {
        competitors: [
          { competitor: { id: 1, players: [{ player: { id: 1 } }] } },
          { competitor: { id: 2, players: [{ player: { id: 2 } }] } }
        ]
      }
    }));
    const req = {};
    const res = {
      send: sendSpy
    };
    await syncTeams(req, res);
    expect(setSpy).toHaveBeenCalledTimes(4);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("Teams synced!");
  });

  it("should send errors", async () => {
    firestore.mockImplementation(() => ({ firestore: jest.fn() }));
    get.mockImplementation(() => ({ data: { data: null } }));
    const req = {};
    const res = {
      send: sendSpy
    };
    await syncTeams(req, res);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
