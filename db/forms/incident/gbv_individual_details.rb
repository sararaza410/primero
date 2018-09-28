gbv_individual_details_fields = [
  Field.new({"name" => "survivor_code",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "text_field",
             "display_name_en" => "Survivor Code",
            }),
  Field.new({"name" => "sex",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "What is the sex of the survivor?",
             "option_strings_source" => "lookup lookup-gender"
            }),
  Field.new({"name" => "date_of_birth",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "date_field",
             "display_name_en" => "What is the survivor's Date of Birth?",
             "date_validation" => "not_future_date"
            }),
  Field.new({"name" => "age",
             "mobile_visible" => false,
             "type" => "numeric_field",
             "display_name_en" => "What is the survivor's age?",
            }),
  Field.new({"name" => "estimated",
             "mobile_visible" => false,
             "type" => "radio_button",
             "display_name_en" => "Is the age estimated?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "ethnicity",
             "mobile_visible" => false,
             "type" => "select_box",
             "display_name_en" => "What is the ethnic affiliation of the survivor?",
             "option_strings_source" => "lookup lookup-ethnicity"
            }),
  Field.new({"name" => "nationality",
             "mobile_visible" => false,
             "type" => "select_box",
             "display_name_en" => "What is the national affiliation of the survivor?",
             "option_strings_source" => "lookup lookup-nationality"
            }),
  Field.new({"name" => "religion",
             "mobile_visible" => false,
             "type" => "select_box",
             "display_name_en" => "What is the religious affiliation of the survivor?",
             "option_strings_source" => "lookup lookup-religion"
            }),
  Field.new({"name" => "country_of_origin",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Country of Origin",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "displacement_status",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Displacement Status at time of report",
             "option_strings_source" => "lookup lookup-displacement-status"
            }),
  Field.new({"name" => "maritial_status",
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Current civil/marital status",
             "option_strings_source" => "lookup lookup-marital-status"
            }),
  Field.new({"name" => "disability_type",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Disability Type",
             "option_strings_source" => "lookup lookup-disability-type-with-no"
            }),
  Field.new({"name" => "unaccompanied_separated_status",
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Is the survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?",
             "option_strings_source" => "lookup lookup-unaccompanied-separated-status",
            })
]

FormSection.create_or_update_form_section({
  unique_id: "gbv_individual_details",
  parent_form: "incident",
  visible: true,
  order_form_group: 50,
  order: 15,
  order_subform: 0,
  form_group_name: "GBV Individual Details",
  editable: true,
  mobile_form: true,
  fields: gbv_individual_details_fields,
  name_en: "GBV Individual Details",
  description_en: "GBV Individual Details"
})
