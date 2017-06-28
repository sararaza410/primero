module Alertable
  extend ActiveSupport::Concern

  ALERT_INCIDENT = 'incident_details'
  ALERT_SERVICE = 'services_section'

  included do
    property :alerts, [], :default => []

    searchable do
      string :current_alert_types, multiple: true
    end
  end

  def current_alert_types
    self.alerts.map {|a| a[:type]}.uniq
  end

  def add_remove_alert(current_user, type = nil, form_sidebar_id = nil)
    if current_user.user_name == self.owned_by && self.alerts != nil
      if type.present?
        self.alerts.delete_if{|x| x[:type] == type}
      else
        self.alerts = []
      end
    elsif current_user.user_name != self.owned_by && self.alerts != nil
      self.alerts << {type: type, date: Date.today, form_sidebar_id: form_sidebar_id}
    end
  end
end