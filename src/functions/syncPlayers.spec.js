import { firestore } from "firebase-admin";
import { get } from "axios";
import syncPlayers from "./syncPlayers";
import getWeek from "./shared/getWeek";

jest.mock("firebase-functions", () => ({ https: { onRequest: fn => fn } }));
jest.mock("firebase-admin", () => ({ firestore: jest.fn() }));
jest.mock("axios", () => ({ get: jest.fn() }));
jest.mock("./shared/getWeek");

describe("syncPlayers", () => {
  const sendSpy = jest.fn();
  const setSpy = jest.fn();
  const consoleErrorSpy = jest.fn();

  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleErrorSpy;
    jest.resetAllMocks();
  });

  it("should sync player data", async () => {
    const docSpy = jest.fn();
    const collectionSpy = jest.fn(() => ({ doc: docSpy }));
    firestore.mockImplementation(() => ({
      batch: () => ({ commit: jest.fn(), set: setSpy }),
      collection: collectionSpy
    }));
    get.mockImplementation(() => ({
      data: { data: [{ playerId: 1 }, { playerId: 2 }, { playerId: 3 }] }
    }));
    getWeek.mockImplementation(() => 0);
    const req = {};
    const res = {
      send: sendSpy
    };
    await syncPlayers(req, res);
    expect(collectionSpy).toHaveBeenCalledWith("runningStats");
    expect(docSpy).toHaveBeenCalledWith("1-2019-0-0");
    expect(setSpy).toHaveBeenCalledTimes(6);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("Player data synced!");
  });

  it("should send errors", async () => {
    firestore.mockImplementation(() => ({
      batch: () => ({ commit: jest.fn(), set: setSpy })
    }));
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
