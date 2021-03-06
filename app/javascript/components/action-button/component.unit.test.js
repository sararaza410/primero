import React from "react";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";

import { DefaultButton, IconButton } from "./components";
import ActionButton from "./component";
import { ACTION_BUTTON_TYPES } from "./constants";

describe("<ActionButton />", () => {
  const props = {
    icon: <></>,
    isCancel: false,
    isTransparent: false,
    pending: false,
    text: "Test",
    type: ACTION_BUTTON_TYPES.default,
    rest: {}
  };
  const state = fromJS({
    application: {
      disableApplication: false
    }
  });

  it("renders DefaultButton type", () => {
    const { component } = setupMountedComponent(ActionButton, props, state);

    expect(component.find(DefaultButton)).to.have.lengthOf(1);
  });

  it("renders IconButton type", () => {
    const { component } = setupMountedComponent(
      ActionButton,
      {
        ...props,
        type: ACTION_BUTTON_TYPES.icon
      },
      state
    );

    expect(component.find(IconButton)).to.have.lengthOf(1);
  });
});
