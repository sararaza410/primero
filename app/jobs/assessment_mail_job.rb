class AssessmentMailJob < ApplicationJob
  queue_as :mailer

  def perform(user_id, case_id, due_date)
    @child = Child.get(case_id)
    return if @child.date_and_time_initial_assessment_completed.present?
    AssessmentMailer.regular_reminder_complete_initial_assessment(case_id, user_id, due_date).deliver_later
  end
end