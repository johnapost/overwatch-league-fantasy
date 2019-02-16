import { firestoreConnect } from "react-redux-firebase";
import withFirestore from "./withFirestore";

jest.mock("react-redux-firebase");

describe("withFirestore", () => {
  const realWindow = global.window;

  beforeEach(() => {
    global.window = realWindow;
    jest.clearAllMocks();
  });

  it("should connect to firebase on client", () => {
    withFirestore([]);
    expect(firestoreConnect).toHaveBeenCalledTimes(1);
  });

  it("should pass argument through on server", () => {
    delete global.window;
    expect(withFirestore([])(true)).toBe(true);
    expect(firestoreConnect).toHaveBeenCalledTimes(0);
  });
});
