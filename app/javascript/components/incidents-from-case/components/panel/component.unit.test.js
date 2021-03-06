import { fromJS } from "immutable";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import IncidentSummary from "../summary";
import IncidentDetail from "../detail";
import { RECORD_TYPES } from "../../../../config";

import IncidentPanel from "./component";

describe("<IncidentPanel /> - Component", () => {
  let component;
  const props = {
    incident: fromJS({
      created_by: "primero_gbv",
      module_id: "primeromodule-gbv",
      incident_date: "2020-09-16",
      owned_by: "primero_gbv",
      date_of_first_report: "2020-10-04",
      gbv_sexual_violence_type: "test1",
      unique_id: "e25c5cb1-1257-472e-b2ec-05f568a3b51e"
    }),
    incidentCaseId: "case-id-1",
    css: {},
    mode: { isShow: false, isEdit: true },
    setFieldValue: () => {},
    handleSubmit: () => {},
    recordType: RECORD_TYPES.cases
  };

  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-gbv-sexual-violence-type",
            name: {
              en: "Gbv Sexual Violence Type"
            },
            values: [
              {
                id: "test1",
                display_text: {
                  en: "Test1"
                }
              },
              {
                id: "test2",
                display_text: {
                  en: "Test2"
                }
              }
            ]
          }
        ]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(IncidentPanel, props, initialState));
  });

  it("render IncidentPanel component", () => {
    expect(component.find(IncidentPanel)).to.have.length(1);
  });

  it("render a ExpansionPanels", () => {
    expect(component.find(ExpansionPanel)).to.have.lengthOf(1);
    expect(component.find(ExpansionPanelSummary)).to.have.lengthOf(1);
    expect(component.find(ExpansionPanelDetails)).to.have.lengthOf(1);
  });

  it("render a IncidentSummary", () => {
    expect(component.find(IncidentSummary)).to.have.lengthOf(1);
  });

  it("render a IncidentSummary", () => {
    expect(component.find(IncidentDetail)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const incidentsProps = { ...component.find(IncidentPanel).props() };

    ["incident", "incidentCaseId", "css", "mode", "setFieldValue", "handleSubmit", "recordType"].forEach(property => {
      expect(incidentsProps).to.have.property(property);
      delete incidentsProps[property];
    });
    expect(incidentsProps).to.be.empty;
  });
});
