import React from "react";
import { shallow } from "enzyme";
import { Button, Input } from "antd";
import { CreateLeagueComponent } from "./createLeague";

describe("CreateLeague", () => {
  describe("component", () => {
    const props = {
      form: {
        getFieldDecorator: jest.fn(() => jest.fn(component => component)),
        getFieldsValue: jest.fn(),
        setFields: jest.fn()
      },
      firestore: {
        get: jest.fn(),
        set: jest.fn(),
        then: jest.fn()
      },
      user: {
        uid: "abc123"
      }
    };

    it("should render fine", () => {
      const wrapper = shallow(<CreateLeagueComponent {...props} />);
      expect(wrapper.html()).toMatchSnapshot();
    });

    describe("when checking league availability", () => {
      it("should disable submission", () => {
        const wrapper = shallow(<CreateLeagueComponent {...props} />);
        wrapper.setState({ checkingLeague: true });
        expect(wrapper.find(Button).prop("disabled")).toBe(true);
        expect(wrapper.find(Input).prop("onPressEnter")).not.toBe(
          wrapper.instance().checkLeague
        );
      });
    });
  });
});
