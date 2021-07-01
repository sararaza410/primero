var FormFields = {
  init: function(options, elem) {
    this.options = $.extend({}, this.options,options);
    this.elem  = elem;
    this.$elem = $(elem);
    this._build();
    return this;
  },

  _build: function() {
    var self = this;
    self.$elem.find(".form").live("click", function() {
      self.selectForm($(this));
    });
    self.$elem.find(".field:not(.prev-selected)").live("click", function() {
      self.selectItem($(this));
    });
    self.$elem.find(".close-link").live("click", function() {
      self.hide();
    });
  },

  selectForm: function(form) {
    var self = this;
    var $selected_form = self.$elem.find(".form.selected");
    var $form = $(form);
    if ($selected_form) {
      $selected_form.removeClass("selected");
      self.$elem.find("#fields-for-" + $selected_form.attr("id")).removeClass("selected");
    }
    $form.addClass("selected");
    self.$elem.find("#fields-for-" + $form.attr("id")).addClass("selected");
  },

  selectItem: function(select_element) {
    var self = this;
    self.hide();
    var selected_field = {
      field_name: $(select_element).data("name"),
      form_id: $(select_element).parents("ul").data("id")
    };
    self.options.onItemSelect(selected_field);
  },

  show: function(args) {
    var self = this;
    self.reset(args.prevSelectedFields);
    if (args.actionElement && args.actionElement.position().top && args.actionElement.position().left && args.actionElement.width()) {
      self.$elem.css("top", args.actionElement.position().top + "px");
      self.$elem.css("left", args.actionElement.position().left + args.actionElement.width() + "px");
    }
    self.$elem.show();
  },

  hide: function() {var self = this; self.$elem.hide();},

  reset: function(prev_selected_fields) {
    var self = this;
    var first_form = self.$elem.find(".form").first();
    self.selectForm(first_form);
    $.each(prev_selected_fields, function(index, field_name) {
     self.$elem.find('#field-' + field_name).addClass("prev-selected");
    });
  }
};

$.plugin('formFields', FormFields);

$(function() {
  $("#locale").change(function(event) {
    var language_field = $(event.target);
    var locale = language_field.val();
    $(".translation_fields").hide().addClass('hide_element');
    if (!_.isUndefined(locale) && locale !== '') {
      $("div ." + locale).show().removeClass('hide_element');
    }
  });

  $("body").on("click", ".cp_comprehensive_assessment_subform_interview_with_child input[id*='are_there_other_children_at_risk_in_the_same_home']", function(e) {
    if($(this).is(':checked')) {
      $('#subform_cp_comprehensive_assessment_subform_other_childs_number_and_date_of_birth_add_button').click()
    } else {
      $('div[id*="subform_container_cp_comprehensive_assessment_subform_other_childs_number_and_date_of_birth"]').each(function(){
        if(!$(this).hasClass('template')) {
          $(this).find('.subform_remove').click();
        }
      });
    }
  });

  $("body").on("click", "[id^='protection_needs_and_capacity_child_cp_comprehensive_assessment_subform_protection_needs_and_capacity_'][id$='_others']", function() {
    if($(this).is(':checked')) {
        $(this).parents('.row').first().next().show();
    } else {
        $(this).parents('.row').first().next().hide();
    }
  });
});

