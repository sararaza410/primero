# frozen_string_literal: true

# This model persists the user-modifiable state of the Primero configuration as JSON.
# If desired, this configuration state can replace the current Primero configuration state.
class PrimeroConfiguration < ApplicationRecord
  CONFIGURABLE_MODELS = %w[FormSection Lookup Agency Role UserGroup Report ContactInformation].freeze

  attr_accessor :apply_now
  validate :validate_configuration_data
  validates :version, uniqueness: { message: 'errors.models.configuration.version.uniqueness' }

  before_create :generate_version

  def self.current(created_by = nil)
    new.tap do |config|
      config.created_on = DateTime.now
      config.created_by = created_by&.user_name
      config.data = current_configuration_data
    end
  end

  def self.current_configuration_data
    CONFIGURABLE_MODELS.each_with_object({}) do |model, data|
      model_class = Kernel.const_get(model)
      data[model] = model_class.all.map(&:configuration_hash)
    end
  end

  def apply_later!(applied_by = nil)
    ApplyConfigurationJob.perform_later(id, applied_by.id)
  end

  def apply_with_api_lock!(applied_by = nil)
    SystemSettings.lock_for_configuration_update
    apply!(applied_by)
    SystemSettings.unlock_after_configuration_update
  end

  def apply!(applied_by = nil)
    data.each do |model, model_data|
      model_class = Kernel.const_get(model)

      model_class.sort_configuration_hash(model_data).each do |configuration|
        model_class.create_or_update!(configuration)
      end
    end
    clear_remainder!
    self.applied_on = DateTime.now
    self.applied_by = applied_by&.user_name
    save!
  end

  def clear_remainder!
    remainder(FormSection).destroy_all
    remainder(Lookup).destroy_all
    remainder(Report).destroy_all
  end

  def remainder(model_class)
    model_data = data[model_class.name]
    configuration_unique_ids = model_data.map { |d| d[model_class.unique_id_attribute.to_s] }
    model_class.where.not(model_class.unique_id_attribute => configuration_unique_ids)
  end

  def validate_configuration_data
    data_is_valid = CONFIGURABLE_MODELS.reduce(true) do |valid, model|
      valid && (%w[Report Location].include?(model) || data[model].size.positive?)
    end
    return if data_is_valid

    errors.add(:data, 'errors.models.configuration.data')
  end

  def generate_version
    return if version

    date = DateTime.now.strftime('%Y%m%d.%H%M%S')
    uid7 = SecureRandom.uuid.last(7)
    self.version = "#{date}.#{uid7}"
  end
end
