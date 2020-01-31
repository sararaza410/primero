import { Map, fromJS } from "immutable";
import { Box, Grid } from "@material-ui/core";

import { setupMountedComponent, expect } from "../../../../test";
import DisplayData from "../../../display-data/component";
import { STATUS_APPROVED } from "../../constants";

import ApprovalDetail from "./component";

describe("<ApprovalDetail /> - Component", () => {
  let component;
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01",
      approval_status: STATUS_APPROVED
    }),
    css: {},
    isRequest: false,
    isResponse: true
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ApprovalDetail, props, Map({})));
  });

  it("render ApprovalDetail component", () => {
    expect(component.find(ApprovalDetail)).to.have.length(1);
  });

  it("render a Grid", () => {
    expect(component.find(Grid)).to.have.lengthOf(5);
  });

  it("render a Box", () => {
    expect(component.find(Box)).to.have.lengthOf(4);
  });

  it("render a DisplayData", () => {
    expect(component.find(DisplayData)).to.have.lengthOf(4);
  });

  it("renders component with valid props", () => {
    const approvalsProps = { ...component.find(ApprovalDetail).props() };

    ["approvalSubform", "css", "isRequest", "isResponse"].forEach(property => {
      expect(approvalsProps).to.have.property(property);
      delete approvalsProps[property];
    });
    expect(approvalsProps).to.be.empty;
  });
});