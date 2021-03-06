import { Map, fromJS } from "immutable";

import { displayNameHelper } from "../../libs";

import { PERMISSIONS, RESOURCE_ACTIONS } from "./constants";
import NAMESPACE from "./namespace";

export const selectAgencies = state => state.getIn([NAMESPACE, "agencies"], fromJS([]));

export const getEnabledAgencies = (state, service) => {
  const enabledAgencies = state.getIn([NAMESPACE, "agencies"], fromJS([])).filter(agency => !agency.get("disabled"));

  if (service) {
    return enabledAgencies.filter(agency => agency.get("services", fromJS([])).includes(service));
  }

  return enabledAgencies;
};

export const selectModules = state => state.getIn([NAMESPACE, "modules"], fromJS([]));

export const selectLocales = state => state.getIn([NAMESPACE, "locales"], fromJS([]));

export const selectUserModules = state =>
  state.getIn([NAMESPACE, "modules"], Map({})).filter(m => {
    const userModules = state.getIn(["user", "modules"], null);

    return userModules ? userModules.includes(m.unique_id) : false;
  });

export const selectModule = (state, id) => {
  return selectUserModules(state)
    .filter(f => f.unique_id === id)
    .first();
};

export const selectUserIdle = state => state.getIn([NAMESPACE, "userIdle"], false);

export const selectNetworkStatus = state => state.getIn([NAMESPACE, "online"], false);

export const getReportingLocationConfig = state => state.getIn([NAMESPACE, "reportingLocationConfig"], fromJS({}));

export const getAgencyLogos = state => state.getIn(["records", "support", "data", "agencies"], fromJS([]));

export const getAgency = (state, id) =>
  state
    .getIn(["application", "agencies"], fromJS([]))
    .filter(agency => agency.get("id") === id)
    .first();

export const getSystemPermissions = state => state.getIn([NAMESPACE, PERMISSIONS], fromJS({}));

export const getResourceActions = (state, resource) =>
  getSystemPermissions(state).getIn([RESOURCE_ACTIONS, resource], fromJS([]));

export const getAgeRanges = (state, name = "primero") => state.getIn([NAMESPACE, "ageRanges", name], fromJS([]));

export const getReportableTypes = state => state.getIn([NAMESPACE, "reportableTypes"], fromJS([]));

export const getApprovalsLabels = (state, locale) => {
  const approvalsLabels = Object.entries(state.getIn([NAMESPACE, "approvalsLabels"], fromJS({})).toJS()).reduce(
    (acc, entry) => {
      const [key, value] = entry;

      return { ...acc, [key]: displayNameHelper(value, locale) };
    },
    {}
  );

  return approvalsLabels;
};

export const getUserGroups = state => state.getIn([NAMESPACE, "userGroups"], fromJS([]));

export const getRoles = state => state.getIn([NAMESPACE, "roles"], fromJS([]));

export const getRole = (state, uniqueID) =>
  getRoles(state).find(role => role.get("unique_id") === uniqueID, null, fromJS({}));

export const getRoleName = (state, uniqueID) => getRole(state, uniqueID).get("name", "");

export const getDisabledApplication = state => state.getIn([NAMESPACE, "disabledApplication"], false);
