import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_AREA, TEXT_FIELD } from "../../../form";

export const validations = () =>
  object().shape({
    description: string(),
    name: string().required()
  });

export const form = (i18n, isShow) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "configurations",
      fields: [
        FieldRecord({
          display_name: i18n.t("configurations.attributes.name"),
          name: "name",
          type: TEXT_FIELD,
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.description"),
          name: "description",
          type: TEXT_AREA
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.version"),
          name: "version",
          type: TEXT_FIELD,
          visible: isShow
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.date_created"),
          name: "date_created",
          type: TEXT_FIELD,
          visible: isShow
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.created_by"),
          name: "created_by",
          type: TEXT_FIELD,
          visible: isShow
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.last_applied_on"),
          name: "last_applied_on",
          type: TEXT_FIELD,
          visible: isShow
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.last_applied_by"),
          name: "last_applied_by",
          type: TEXT_FIELD,
          visible: isShow
        })
      ]
    })
  ]);
};
