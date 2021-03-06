import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { METHODS, RECORD_PATH, SAVE_METHODS } from "../../../../config";

import { getFormRequestPath } from "./utils";
import actions from "./actions";

export const fetchForm = id => ({
  type: actions.FETCH_FORM,
  api: {
    path: `${RECORD_PATH.forms}/${id}`
  }
});

export const setSelectedField = name => ({
  type: actions.SET_SELECTED_FIELD,
  payload: { name }
});

export const setSelectedSubform = payload => ({
  type: actions.SET_SELECTED_SUBFORM,
  payload
});

export const setSelectedSubformField = name => ({
  type: actions.SET_SELECTED_SUBFORM_FIELD,
  payload: { name }
});

export const updateSelectedField = (data, subformId = null) => ({
  type: actions.UPDATE_SELECTED_FIELD,
  payload: { data, subformId }
});

export const updateSelectedSubform = data => ({
  type: actions.UPDATE_SELECTED_SUBFORM,
  payload: { data }
});

export const reorderFields = (name, order, isSubform) => ({
  type: actions.REORDER_FIELDS,
  payload: { name, order, isSubform }
});

export const saveForm = ({ id, body, saveMethod, message }) => {
  const method = saveMethod === SAVE_METHODS.update ? METHODS.PATCH : METHODS.POST;

  return {
    type: actions.SAVE_FORM,
    api: {
      path: getFormRequestPath(id, saveMethod),
      method,
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        },
        redirectToEdit: true,
        redirect: `/admin/${RECORD_PATH.forms}`
      }
    }
  };
};

export const saveSubforms = (subforms, { id, body, saveMethod, message }) => {
  const subformsRequest = subforms.map(subform => {
    const subfomBody = {
      data: subform
    };

    if (subform?.id) {
      return {
        path: getFormRequestPath(subform.id, SAVE_METHODS.update),
        method: METHODS.PATCH,
        body: subfomBody
      };
    }

    return {
      path: getFormRequestPath("", SAVE_METHODS.new),
      method: METHODS.POST,
      body: subfomBody
    };
  });

  return {
    type: actions.SAVE_SUBFORMS,
    api: [...subformsRequest],
    finishedCallbackSubforms: saveForm({ id, body, saveMethod, message })
  };
};

export const setNewField = (data, isSubform) => ({
  type: isSubform ? actions.SET_NEW_FIELD_SUBFORM : actions.SET_NEW_FIELD,
  payload: data
});

export const createSelectedField = data => ({
  type: actions.CREATE_SELECTED_FIELD,
  payload: { data }
});

export const clearSelectedForm = () => ({
  type: actions.CLEAR_SELECTED_FORM
});

export const clearSelectedSubform = () => ({
  type: actions.CLEAR_SELECTED_SUBFORM
});

export const clearSelectedField = () => ({
  type: actions.CLEAR_SELECTED_FIELD
});

export const clearSelectedSubformField = () => ({
  type: actions.CLEAR_SELECTED_SUBFORM_FIELD
});

export const updateFieldTranslations = translations => ({
  type: actions.UPDATE_FIELD_TRANSLATIONS,
  payload: translations
});

export const clearSubforms = () => ({
  type: actions.CLEAR_SUBFORMS
});

export const setNewSubform = payload => ({
  type: actions.SET_NEW_SUBFORM,
  payload
});

export const setTemporarySubform = payload => ({
  type: actions.SET_TEMPORARY_SUBFORM,
  payload
});

export const mergeOnSelectedSubform = payload => ({
  type: actions.MERGE_SUBFORM_DATA,
  payload
});

export const selectExistingFields = payload => ({
  type: actions.SELECT_EXISTING_FIELDS,
  payload
});
