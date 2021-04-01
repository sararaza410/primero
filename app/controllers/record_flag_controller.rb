class RecordFlagController < ApplicationController

  before_action :current_user
  before_action :set_class_name
  before_action :set_record

  include RecordFilteringPagination

  include LoggerActions

  def flag
    authorize! :flag, @record
    flag = @record.add_flag(params[:flag_message], params[:flag_comments], params[:flag_date], current_user_name)
    if @record.save
      render :json => flag if params[:redirect_url].blank?
    else
      render :json => {:error => @record.errors.full_messages + flag.errors.full_messages} if params[:redirect_url].blank?
    end
    #TODO should we keep? the parameter is to keep compatibilty with the current tag form, but that will change.
    redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url].present?
  end

  def unflag
    authorize! :flag, @record
    flag = @record.remove_flag(params[:flag_message], params[:flag_index], current_user_name, params[:unflag_message], DateTime.now)
    if flag.present? and @record.save
      render :json => flag if params[:redirect_url].blank?
    else
      render :json => {:error => @record.errors.full_messages + [I18n.t("errors.models.flags.index", :index => params[:flag_index])]} if params[:redirect_url].blank?
    end
    #TODO should we keep? the new unflag feature for multiple flags is not implemented yet.
    redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url].present?
  end

  def flag_records
    authorize! :flag, @model_class
    error_message = ""
    child_filters = nil
    records_to_flag = []
    success = true

    if @model_class == Child
      child_filters = filter
      child_filters["child_status"] ||= {:type => "single", :value => "open"}
    end

    begin
      if params[:apply_to_all] == "true"
        pagination_ops = {:page => 1, :per_page => 100}
        begin
          search = @model_class.list_records(child_filters||filter, order, pagination_ops, users_filter[:user_names], params[:query], nil, users_filter[:user_group_ids])
          results = search.results
          records_to_flag.concat(results)
          pagination_ops[:page] = results.next_page
        end until results.next_page.nil?
      else
        records_to_flag = @model_class.all(keys: params[:selected_records]).all
      end

      records_to_flag.each do |record|
        record.add_flag(params[:flag_message], params[:flag_comments], params[:flag_date], current_user_name)
        #TODO: Removed the error message. We don't really need it. May need to catch errors thrown by batch update below
        #error_message += "\n#{I18n.t("messages.record_not_flagged_message", short_id: record.short_id)}" unless record.valid?
      end

      #TODO: For now only batch flagging is relying on the CouchWatcher notifier to reindex
      @model_class.save_all!(records_to_flag)
      #If this is a non-production deployment, trigger the indexing of flags
      if Rails.env != 'production'
        Sunspot.index(records_to_flag)
        records_to_flag.each(&:index_flags)
      end
    rescue
      success = false
      error_message = I18n.t("messages.flag_multiple_records_error_message")
    end

    render json: {success: success, error_message: error_message, reload_page: true}
  end

  private

  def set_class_name
    #Tag the model from the params, the parameter is injected by the routes and don't allow any arbitrary class
    #just the one defined in the routes.
    @model_class = params[:model_class].constantize
  end

  def set_record
    id = params[:id]
    @record = @model_class.get(id)
  end

  #Override method in LoggerActions.
  def logger_action_identifier
    if action_name == "flag_records"
      if params[:selected_records].present?
        "#{params[:selected_records].length} #{logger_model_titleize.pluralize}"
      elsif params[:id].blank?
        logger_model_titleize.pluralize
      else
        super
      end
    else
      super
    end
  end

end
