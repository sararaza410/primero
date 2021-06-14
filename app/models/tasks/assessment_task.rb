module Tasks
  class AssessmentTask < Task
    def self.from_case(record)
      tasks = []
      if has_task?(record)
        tasks = [AssessmentTask.new(record)]
      end
      return tasks
    end

    def self.has_task?(record)
      (record.try(:assessment_due_date).present? &&
      !record.try(:assessment_requested_on).present?) ||
      record.try(:due_date_for_comprehensive_assessment).present?
    end

    def due_date
      self.parent_case.due_date_for_comprehensive_assessment || self.parent_case.assessment_due_date
    end
  end
end
