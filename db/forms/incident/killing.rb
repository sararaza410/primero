require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

killing_subform_fields = [
  Field.new({"name" => "violation_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of victims",
           "autosum_group" => "killing_number_of_victims",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
          }),
  Field.new({"name" => "cause",
             "type" => "select_box",
             "display_name_all" => "Type of weapon",
             "option_strings_source" => "lookup WeaponType"
            }),
  Field.new({"name" => "cause_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please specify"
            }),
  Field.new({"name" => "circumstances",
             "type" => "select_box",
             "display_name_all" => "Type of attack",
             "option_strings_source" => "lookup AttackType"
            }),
  Field.new({"name" => "circumstances_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please specify "
            }),
  Field.new({"name" => "victim_targeted",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) directly targeted?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "victim_a_participant",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) directly participating in hostilities at the time of the violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "indiscriminate_nature",
             "type" => "select_box",
             "display_name_all" => "Any elements pointing to the indiscriminate nature of the attack?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "indiscriminate_nature_yes",
             "type" => "text_field",
             "display_name_all" => "If 'Yes', please specify "
            }),
  Field.new({"name" => "associated_violation_status",
             "type" => "select_box",
             "display_name_all" => "Did the violation occur during or as a direct result of, or was related to, another violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  #NOTE: The following is a multi-select, but made it violation instead of violations so as not to conflict with reload violations JS
  Field.new({"name" => "associated_violation",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If 'Yes', please specify:",
             "option_strings_source" => "lookup ViolationType"
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details:"
            })
]

#binding.pry

killing_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 1,
  :unique_id => "killing",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (killing_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Killing Subform",
  "description_all" => "Nested Killing Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["cause"]
})

killing_fields = [
  Field.new({"name" => "killing",
             "type" => "subform", "editable" => true,
             "subform_section_id" => killing_subform_section.unique_id,
             "display_name_all" => "Killing",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "killing_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => killing_fields,
  "name_all" => "Killing",
  "description_all" => "Killing"
})