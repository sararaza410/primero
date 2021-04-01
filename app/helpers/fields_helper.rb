module FieldsHelper

  def field_tag_name(object, field, field_keys=[])
    if field_keys.present?
      "#{object.class.name.underscore.downcase}[#{field_keys.join('][')}]"
    else
      field.tag_name_attribute(object.class.name.underscore.downcase)
    end
  end

  #Use to return date or datetime as string for display in local time
  #TODO-time: This function converts the UTC DateTimes in the model to local time for display in the browser
  #ALL browser displayed times should pass through this function
  def field_format_date(a_date)
    if a_date.present? && a_date.instance_of?(Date)
      I18n.l(a_date)
    elsif a_date.present? && a_date.instance_of?(DateTime)
      I18n.l(a_date.in_time_zone, format: :with_time)
    else
      a_date
    end
  end

  def field_value(object, field, field_keys=[])
    if field.nil?
      object.value_for_attr_keys(field_keys)
    elsif field_keys.include? "template"
       # If 'template' exists in the field_keys, this is a new subform
       # The 'template' key is later replaced with the proper index value via JavaScript
       # But for now, there is no value so just return empty string
       ''
    elsif field.is_yes_no?
      parent_obj = object.value_for_attr_keys(field_keys[0..-2])
      value = field.convert_true_false_key_to_string(parent_obj.try(field.name))
    else
      parent_obj = object.value_for_attr_keys(field_keys[0..-2])
      case field.type
      when Field::TALLY_FIELD
        (field.tally + ['total']).map {|t| parent_obj.try(:[],"#{field.name}_#{t}") }
      when Field::DATE_RANGE
        [field_format_date(parent_obj.try(:[],"#{field.name}_from")), field_format_date(parent_obj.try(:[],"#{field.name}_to"))]
      when Field::DATE_FIELD
        field_format_date(parent_obj.try(:[],field.name))
      else
        parent_obj.try(:[],field.name) || parent_obj.try(field.name) || ''
      end
    end
  end

  def field_uuid
    SecureRandom.uuid
  end

  def field_value_for_display(field_value, field=nil, lookups=nil)
    value = if field_value.is_a?(Array)
      values = field_value
      values = values.map{ |v| field.display_text(v) } if field.present? && field.selectable?
      values.join(', ')
    elsif field_value.is_a?(Date) || field_value.is_a?(Time)
      field_format_date(field_value)
    elsif field_value.blank? && [true, false].exclude?(field_value)
      ""
    else
      if field.present?
        field.display_text(field_value, lookups)
      else
        field_value
      end
    end

    return value.to_s
  end

  def select_options(field, record=nil, lookups=nil, exclude_empty_item=false, add_lookups=false)
    select_options = []
    if field.present?
      select_options << [I18n.t("fields.select_box_empty_item"), ''] unless (field.type == Field::TICK_BOX || field.multi_select || exclude_empty_item)
      select_options += field.options_list(record, lookups, nil, add_lookups)
        .map(&:with_indifferent_access)
        .map {|option| [option['display_text'], option['id']]}
    end
    select_options
  end

  def with_blank_option(options)
    select_options = []
    select_options << [I18n.t("fields.select_box_empty_item"), '']
    select_options += options if options.present?
    select_options
  end

  def field_link_for_display(field_value, field)
    link_to(field_value, send("#{field.link_to_path}_path", id: field_value.split('::').first)) if field_value.present?
  end

  def field_value_for_multi_select(field_value, field, parent_obj=nil, lookups=nil)
    if field_value.blank?
      ""
    elsif field.option_strings_source == 'violations'
      #TODO MRM fix
      # This is about the cleanest way to do this without totally reworking the
      # template logic.  Just hope we don't ever have any relevant fields
      # nested more than one level
      if parent_obj['couchrest-type'] != 'Incident'
        inc = parent_obj.casted_by
      else
        inc = parent_obj
      end

      field_value.map do |violation_id|
        vtype, violation = inc.find_violation_by_unique_id(violation_id)
        inc.violation_label(vtype, violation, true, lookups: lookups)
      end.join('; ')
    else
      options = []
      lookup = field.options_list(nil, nil, nil, true)
      if field_value.is_a?(Array)
        field_value.each do |option|
          if lookup.present?
            lookup_value = lookup.select{|lv| lv["id"] == option}.first
            options << lookup_value["display_text"] if lookup_value.present?
          else
            selected = (field.option_strings_text.is_a?(Array) ? field.option_strings_text.select{|o| o['id'] == option} : option)
            options << selected
          end
        end
      else
        selected = lookup.select{|lv| lv["id"] == field_value}.first
        options << selected
      end
      return options.flatten.collect{|a| a.try(:[], 'display_text') || a }.join(', ')
    end
  end

  def field_keys(subform_name, subform_index, field_name, form_group_id)
    field_key = []
    field_key << form_group_id if form_group_id.present? && form_group_id == "violations"
    field_key << subform_name << subform_index if subform_name.present?
    field_key << field_name
    return field_key
  end

  def subforms_count(object, field, form_group_id = "")
    subforms_count = 0
    # This is for shared subforms
    shared_subform = field.subform_section.shared_subform.downcase if field.subform_section.try(:shared_subform)
    shared_subform_group = field.subform_section.shared_subform_group.downcase if field.subform_section.try(:shared_subform_group)

    # needed for all derived subforms
    if object.try(field.name).present?
      subforms_count = object.try(field.name).count
    # needed for all the regular subforms
    elsif object.try(:[], field.name).present?
      subforms_count = object.try(:[], field.name).count
    elsif object[shared_subform].present?
      object[shared_subform].count
    elsif form_group_id.present? && object[form_group_id].present? && object[form_group_id][field.name].present?
      subforms_count = object[form_group_id][field.name].count
    elsif object[shared_subform_group].present? && object[shared_subform_group][shared_subform].present?
      subforms_count = object[shared_subform_group][shared_subform].count
    end
    return subforms_count
  end

  def get_subform_object(object, subform_section, form_group_id, subform_name)
    subform_object = {}
    if form_group_id.present? && form_group_id == "violations" && object[form_group_id].present?
      subform_object = object[form_group_id][subform_section.unique_id]
    #TODO: This code is being temporarily removed until JOR-141 (users should only see their own referrals) is again revisited,
    #      Pending a full refactor of how we do nested forms headers
    # elsif subform_name == "transitions"
    #   subform_object = object.try(:"#{subform_name}")
    #   #if user is record owner, they can see all referrals
    #   if subform_object.present? && object.owned_by != @current_user.user_name
    #     subform_object = subform_object.select do |transition|
    #       if transition.type == Transition::TYPE_REFERRAL
    #         @current_user.is_admin? ||
    #         @current_user.has_group_permission?(Permission::GROUP) ||
    #         transition.to_user_local == @current_user.user_name
    #       else
    #         true
    #       end
    #     end
    #   end
    else
      subform_object = object.try(:"#{subform_name}")
    end
    return subform_object
  end

  def violation_status(formObject, form_group_id, subform_name, index)
    return unless form_group_id == 'violations'
    if form_group_id.present? &&
      formObject[form_group_id].present? &&
      !formObject[form_group_id][subform_name].empty? &&
      index != 'template' &&
      formObject[form_group_id][subform_name][index].present?
      verification_status = formObject[form_group_id][subform_name][index].ctfmr_verified
      content_tag :span, class: 'verification_status' do
        "(#{Lookup.display_value('lookup-verification-status', verification_status, @lookups)})"
      end
    end
  end

  #Return the corresponding template to render the field.
  #Edit mode and show mode might have different ways to render fields.
  #Returns custom_template if defined.
  def field_template_path(field, is_show=false)
    return field.custom_template if field.custom_template.present?
    if is_show
      "form_section/field_display_#{field.display_type}"
    else
      "form_section/#{field.type}"
    end
  end

  def option_string_source_data_attr(source)
    if source.present?
      source_match = source.match /lookup-.*/

      if source_match
        source_match[0]
      else
        source
      end
    end
  end

  def selected_date_value(value_string)
    #TODO-time: This if statement is a temporary fix
    #When the 'parse_single_value' is updated the statement should be replaced with
    #just the contents of the else: 'date_value = PrimeroDate.date_value(value_string)'
    if value_string.downcase == 'today'
      date_value = DateTime.send('current').to_date
    else
      date_value = PrimeroDate.date_value(value_string)
    end
    field_format_date(date_value)
  end

  def locale_name_from_abbreviation(locale)
    loc = Primero::Application::locales_with_description.select{|loc| loc[1] == locale.to_s}[0]
    loc.present? ? loc[0] : locale
  end

  def is_phone_field?(field_id)
    field_id.include?('mobile') || field_id.include?('phone') || field_id.include?('contact') || field_id.include?('landline')
  end
end
