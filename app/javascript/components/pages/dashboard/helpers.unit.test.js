import { fromJS } from "immutable";

import { expect } from "../../../test";

import * as helper from "./helpers";

describe("<Dashboard /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["toData1D", "toListTable"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("toData1D", () => {
    const casesWorkflow = fromJS({
      name: "dashboard.workflow",
      type: "indicator",
      stats: {
        new: {
          count: 10,
          query: ["workflow=new"]
        },
        service_provision: {
          count: 15,
          query: ["workflow=service_provision"]
        },
        care_plan: {
          count: 8,
          query: ["workflow=care_plan"]
        }
      }
    });

    it("should convert data to plain JS", () => {
      const expected = {
        labels: ["New", "Service provision", "Care plan"],
        data: [10, 15, 8],
        query: [
          ["workflow=new"],
          ["workflow=service_provision"],
          ["workflow=care_plan"]
        ]
      };

      const workflowLabels = [
        { id: "new", display_text: "New" },
        { id: "reopened", display_text: "Reopened" },
        { id: "case_plan", display_text: "Case Plan" },
        { id: "care_plan", display_text: "Care plan" },
        { id: "action_plan", display_text: "Action plan" },
        { id: "service_provision", display_text: "Service provision" },
        { id: "services_implemented", display_text: "Service Implemented" },
        { id: "closed", display_text: "Closed" }
      ];

      expect(helper.toData1D(casesWorkflow, workflowLabels)).to.deep.equal(
        expected
      );
    });

    it("should not return labels if there are not translations", () => {
      const { labels } = helper.toData1D(casesWorkflow, []);

      expect(labels).to.be.empty;
    });
  });

  describe("toListTable", () => {
    it("should convert data to plain JS", () => {
      const data = fromJS({
        name: "dashboard.workflow_team",
        type: "indicator",
        stats: {
          "": {
            "": {
              count: 0,
              query: ["status=open", "owned_by=", "workflow="]
            },
            case_plan: {
              count: 0,
              query: ["status=open", "owned_by=", "workflow="]
            },
            new: {
              count: 0,
              query: ["status=open", "owned_by=", "workflow="]
            }
          },
          primero: {
            "": {
              count: 0,
              query: ["status=open", "owned_by=primero", "workflow="]
            },
            case_plan: {
              count: 1,
              query: ["status=open", "owned_by=primero", "workflow=case_plan"]
            },
            new: {
              count: 3,
              query: ["status=open", "owned_by=primero", "workflow=count"]
            }
          }
        }
      });

      const labels = [
        { id: "new", display_text: "New" },
        { id: "reopened", display_text: "Reopened" },
        { id: "case_plan", display_text: "Case Plan" }
      ];

      const expected = {
        columns: [
          { name: "", label: "" },
          { name: "case_plan", label: "Case Plan" },
          { name: "new", label: "New" }
        ],
        data: [{ "": "primero", case_plan: 1, new: 3 }],
        query: [
          {
            "": "primero",
            case_plan: [
              "status=open",
              "owned_by=primero",
              "workflow=case_plan"
            ],
            new: ["status=open", "owned_by=primero", "workflow=count"]
          }
        ]
      };

      expect(helper.toListTable(data, labels)).to.deep.equal(expected);
    });
  });
});