class AssessmentMailer < ActionMailer::Base
  def start_initial_assessment(case_id, user_id)
    @user = User.get(user_id)
    @child = Child.get(case_id)
    @case_type = @child.is_this_a_significant_harm_case ? 'Significant Harm' : 'Regular'
    @due_date = @child.registration_completion_date + (@child.is_this_a_significant_harm_case ? 24.hours : 72.hours)
    @hours = @child.is_this_a_significant_harm_case ? 24 : 72
    @url = host_url

    if @child.present?
      mail(:to => @user.email,
           :subject => "Start initial assessment on #{@child.short_id}")
    else
      Rails.logger.error "Mail not sent - Case [#{case_id}] not found"
    end
  end

  def complete_initial_assessment(case_id, user_id)
    @user = User.get(user_id)
    @child = Child.get(case_id)
    @case_type = @child.is_this_a_significant_harm_case ? 'Significant Harm' : 'Regular'
    @due_date = @child.assessment_due_date
    @url = host_url

    if @child.present?
      mail(:to => @user.email,
           :subject => "Complete initial assessment on #{@child.short_id}")
    else
      Rails.logger.error "Mail not sent - Case [#{case_id}] not found"
    end
  end

  def start_comprehensive_assessment(case_id, user_id)
    @user = User.get(user_id)
    @child = Child.get(case_id)
    @case_type = @child.is_this_a_significant_harm_case ? 'Significant Harm' : 'Regular'
    @due_date = @child.due_date_for_comprehensive_assessment
    @url = host_url

    if @child.present?
      mail(:to => @user.email,
           :subject => "Complete comprehensive assessment on #{@child.short_id}")
    else
      Rails.logger.error "Mail not sent - Case [#{case_id}] not found"
    end
  end
end
