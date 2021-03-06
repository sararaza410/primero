import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { batch, useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";

import ActionDialog from "../../action-dialog";
import { useI18n } from "../../i18n";
import { getRecordFormsByUniqueId, constructInitialValues } from "../../record-form";
import { MODULES, RECORD_TYPES, ID_FIELD } from "../../../config";
import { saveRecord, selectRecordsByIndexes } from "../../records";
import { compactValues } from "../../record-form/utils";
import submitForm from "../../../libs/submit-form";
import resetForm from "../../../libs/reset-form";
import { ACTIONS } from "../../../libs/permissions";
import { fetchRecordsAlerts } from "../../records/action-creators";
import { fetchAlerts } from "../../nav/action-creators";
import { INCIDENT_DIALOG } from "../constants";

import { NAME, INCIDENT_SUBFORM, INCIDENTS_SUBFORM_NAME } from "./constants";
import Fields from "./fields";

const Component = ({ open, close, pending, recordType, selectedRowsIndex, setPending }) => {
  const formikRef = useRef();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const form = useSelector(state =>
    getRecordFormsByUniqueId(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: MODULES.CP,
      formName: INCIDENT_SUBFORM,
      checkVisible: false
    })
  );

  const selectedIds = useSelector(state =>
    selectRecordsByIndexes(state, recordType, selectedRowsIndex).map(record => record.get(ID_FIELD))
  );

  useEffect(() => {
    if (open) {
      resetForm(formikRef);
    }
  }, [open]);

  if (!form?.toJS()?.length) {
    return [];
  }

  const { subform_section_id: subformSectionID, name: subformName } = form
    .first()
    .fields.find(field => field.name === INCIDENTS_SUBFORM_NAME);
  const initialFormValues = constructInitialValues([subformSectionID]);

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.save"),
    dialogTitle: i18n.t("actions.incident_details_from_case"),
    cancelHandler: close,
    onClose: close,
    open,
    pending,
    omitCloseAfterSuccess: true,
    successHandler: () => submitForm(formikRef)
  };

  const fieldsProps = {
    recordType,
    fields: subformSectionID.toJS().fields
  };

  const formProps = {
    initialValues: initialFormValues,
    validateOnBlur: false,
    validateOnChange: false,
    ref: formikRef,
    onSubmit: (values, { setSubmitting }) => {
      const body = {
        data: {
          [subformName]: [
            {
              ...compactValues(values, initialFormValues)
            }
          ]
        },
        record_action: ACTIONS.INCIDENT_DETAILS_FROM_CASE
      };

      setPending(true);
      selectedIds.forEach(id => {
        batch(async () => {
          await dispatch(
            saveRecord(
              recordType,
              "update",
              body,
              id,
              i18n.t(`incident.messages.creation_success`),
              false,
              false,
              false,
              INCIDENT_DIALOG
            )
          );
          dispatch(fetchRecordsAlerts(recordType, id));
        });
      });
      dispatch(fetchAlerts());
      setSubmitting(false);
    }
  };

  return (
    <Formik {...formProps}>
      <ActionDialog {...modalProps}>
        <Form noValidate autoComplete="off">
          <Fields {...fieldsProps} />
        </Form>
      </ActionDialog>
    </Formik>
  );
};

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array,
  setPending: PropTypes.func
};

Component.displayName = NAME;

export default Component;
