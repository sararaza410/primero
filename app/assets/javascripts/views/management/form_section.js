function form_section() {
  if($('.form_page').length == 0){
    return;
  }
  $(".delete").click(deleteItem);
  $(".add_field").click(toggleFieldPanel);
  $(".add_field_button").click(clearFlashMsg);
  $(".field_types a").click(showFieldDetails);
  $(".field_hide_show").bind('change',fieldHideShow);
  $(".link_moveto").click(showMovePanel);
  $("a#field_option_add_button").click(addOption);
  $("a.field_option_remove_button").click(removeOption);

  document.addEventListener('turbolinks:before-cache', function() {
    $('select').chosen('destroy');
  });

  document.addEventListener("turbolinks:load", function() {
    _primero.chosen('select');
  });

  $('#add_field_modal').parent('.reveal-overlay').unbind('click');
  $('#add_field_modal .close-button').unbind('click');

  $('#add_field_modal').parent('.reveal-overlay').on('click', function(e) {
    if( e.target !== this) {
      return;
    }
    e.preventDefault();
    _primero.request_confirmation(backToPrevious);
  });

  $('#add_field_modal .close-button').on('click', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    _primero.request_confirmation(backToPrevious);
  });

  triggerErrors();
  var $rows = $("#form_sections tbody");
  $rows.sortable({
    update: function(){
      var datas = [];
      $(this).find("tr").each(function(index, ele){
        datas.push($(ele).attr("data"));
      });
      $.post($($.find("#save_order_url")).val(), {'ids' : datas});
    }
  });
  $(".field_location").bind('change', changeForm);

  init_show_form();
  function init_show_form() {
    var content = $(".field_types a.sel").attr('id');
    $(getFieldDetails(content)).show();
  }

  function changeForm(event){
    var $parent_div = $($(event.target).parents('.field-buttons'));
    $parent_div.find(".destination_form_id").val($(this).val());
    $parent_div.find("form").submit();
  }

  function fieldHideShow(){
    $.post($($.find("#toggle_url")).val(), {'id' : $(this).val()});
    $("table#form_sections tbody").sortable();
  }

  function showMovePanel(){
    var $this = $(this);
    $this.toggleClass("sel");
    $('.move_to_panel').addClass('hide');
    $this.parents('ul').siblings(".move_to_panel").toggleClass("hide");
  }

  function triggerErrors(){
    if((typeof(show_add_field) != 'undefined') && (show_add_field)){
      toggleFieldPanel(null, getFieldDetails(field_type));
      $(".field_types a").removeClass("sel");
      $("#"+field_type).addClass("sel");
    }
  }

  function backToPrevious(){
    //Only go back to previous url if editing a field
    //For add field, stay at this url unless there are errors
    if(((typeof(edit_field_mode) != 'undefined') && (edit_field_mode)) || ($("#add_field_modal").find("#errorExplanation").length > 0)){
      window.history.back();
    } else {
      $('#add_field_modal').foundation('close');
    }
  }

  function addOption(){
    var $this = $(this);
    var newOption = $(JST['templates/options_row']({
      locale: $this.data('given-lang'),
      id: '',
      display_text: '',
      editing: $this.hasClass('edit_option'),
      locale_options: $this.data('lang'),
      help_text: $this.data('help-text')
    }));
    newOption.find('a.field_option_remove_button').click(removeOption);
    $this.parents('.options_row_controls').before(newOption);
    var current_locale_selection = $('#field_details_select_box').find('#locale').val();
    if (!_.isUndefined(current_locale_selection) &&
        current_locale_selection !== '') {
      newOption.find('.' + current_locale_selection).show();
    }
  }

  function removeOption(){
    $(this).parent().parent().remove();
  }

  function clearFlashMsg(){
    $(".flash.row").empty();
  }

  function toggleFieldPanel(event, div_to_show){
    var $field_details_overlay = $(".field_details_overlay");
    var $field_details_panel = $(".field_details_panel");
    resetAddField();
    if(div_to_show === undefined){
      div_to_show = "#field_details";
    }
    var edit_url = $("#edit_url").val();
    if(event != null && $(event.target).hasClass("add_field") && edit_url.indexOf(window.location.pathname) < 0){
      window.location = edit_url + "?show_add_field=true";
      return;
    }
    $(div_to_show).slideDown();
    $field_details_overlay.css("height",$(document).height());
    $field_details_panel.css("top", pageYOffset + 150);
    $(".translation_lang_selected").text($("#locale option:selected").text());
    $("#err_msg_panel").hide();
    $field_details_overlay.toggleClass("hide");
    $field_details_panel.toggleClass("hide");
    configureFieldMultiSelect($(".field_types a").attr("id"));
  }

  function resetAddField(){
    $('#field_details_tally').hide();
    $('#field_details_tick_box').hide();
    $('#field_details_select_box').hide();
    $('#field_details_options').hide();
    $('#field_details').hide();
    $(".field_types a").removeClass("sel");
    $("#text_field").addClass("sel");
  }

  function showFieldDetails(e){
    var $this = $(this);
    var $field_types = $(".field_types");
    e.preventDefault();
    $field_types.find("a").removeClass("sel");
    $field_types.find("li").removeClass("current");
    $this.addClass("sel");
    $this.parent('li').addClass("current");
    $("#err_msg_panel").hide();


    $("#field_details_options, #field_details_select_box, #field_details_tally, #field_details_tick_box, #field_details").hide();

    $(".field_panel input[type='text'], .field_panel textarea").val("");
    var _this = this;
    $(".field_type").each(function(){
      $(this).val(_this.id);
    })
    $(getFieldDetails(this.id)).show();
    configureFieldMultiSelect(this.id);
  }

  function configureFieldMultiSelect(field_type){
    var $multi_select =  $("#field_details_options .placeholder_multi_select, #field_details .placeholder_multi_select");
    if (field_type != "select_box") {
      $multi_select.hide();
    } else {
      $multi_select.show();
    }
  }

  function getFieldDetails(field_type){
    if(field_type == "tally_field"){
      return "#field_details_tally";
    } else if(field_type == "select_box") {
      return "#field_details_select_box";
    } else if(field_type == "tick_box") {
      return "#field_details_tick_box";
    } else {
      var fields_with_options = ["radio_button"];
      return $.inArray(field_type, fields_with_options) > -1 ? "#field_details_options" : "#field_details";
    }
  }

  function deleteItem() {
    var $td = $(this).parents("td");
    var field_name = $td.find("input[name=field_name]").val();
    $('#deleteFieldName').val(field_name);
    if (confirm(I18n.t("messages.delete_item"))) {
      $('#'+field_name+'deleteSubmit').click();
    }
  }
};

function setTranslationFields(element) {
  var locale = $(element).val();
  $(".translation_forms").hide();
  if (!_.isUndefined(locale) && locale !== '') {
    $("div ." + locale).show();
  }
}

function on_ready() {
  form_section();

  $(".locale").change( function(event){
    setTranslationFields(event.target);
  });

  if ($('.cp_alternative_care_placement_form .chosen-select').length > 0) {
    $chosen = $(this).chosen();
    var chosen = $chosen.data("chosen");
    var _fn = chosen.result_select;
    chosen.result_select = function(evt) {
    evt["metaKey"] = true;
    evt["ctrlKey"] = true;
    chosen.result_highlight.addClass("result-selected");
    return _fn.call(chosen, evt);
    };
  };
};

$(on_ready);
