namespace :cases do
  desc "Reminder emails for SHC cases"
  task :shc_reminders => :environment do
    Child.all.all.each do |child|
      if child.is_this_a_significant_harm_case &&
         child.registration_completion_date.present? &&
         child.date_and_time_initial_assessment_completed.blank? &&
         Date.today < child.assessment_due_date

        due_date = Date.today + 1.day
        username = child.changes['last_updated_by'].present? ? child.changes['last_updated_by'].last : child.owned_by
        user_id = User.find_by_user_name(username).id
        puts child.case_id

        AssessmentMailer.shc_reminder_complete_initial_assessment(child.case_id, user_id, due_date.to_s).deliver_later
      end
    end
  end
end