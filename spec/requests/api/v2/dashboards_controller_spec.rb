require 'rails_helper'

describe Api::V2::DashboardsController, type: :request do

  before :each do
    SystemSettings.stub(:current).and_return(SystemSettings.new(
      reporting_location_config: {
        admin_level: 2,
        field_key: 'owned_by_location'
      }
    ))

    @permission_case = Permission.new(
      resource: Permission::CASE, actions: [Permission::READ]
    )
    @permission_dashboard = Permission.new(
      resource: Permission::DASHBOARD, actions: [Permission::DASH_WORKFLOW, Permission::DASH_CASE_OVERVIEW, Permission::DASH_REPORTING_LOCATION]
    )

    group1 = UserGroup.create!(name: 'Group1')

    @foo = User.new(user_name: 'foo', user_groups: [group1])
    @foo.save(validate: false)
    @bar = User.new(user_name: 'bar', user_groups: [group1])
    @bar.save(validate: false)

    Location.create!( placename_en: "Country", location_code:"CNT", admin_level: 0, type: "country", hierarchy_path: "")
    Location.create!( placename_en: "State", location_code:"STE", admin_level: 1, type: "state", hierarchy_path: "CTE")
    Location.create!( placename_en: "City", location_code:"CTY", admin_level: 2, type: "city", hierarchy_path: "CTE.STE")

    Child.create!(data: { record_state: true, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar', workflow: 'assessment' })
    Child.create!(data: { record_state: false, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 1.day.ago, workflow: 'closed' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 2.days.ago, workflow: 'closed' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 15.days.ago, workflow: 'closed' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'bar', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'bar', owned_by_location: 'CTY' })

    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/dashboards', search: true do

    it 'lists statistics for permitted dashboards' do

      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )
      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)

      case_overview_dashboard = json['data'].find { |d| d['name'] == 'dashboard.case_overview' }
      expect(case_overview_dashboard['indicators']['open']['count']).to eq(2)
      expect(case_overview_dashboard['indicators']['open']['query']).to match_array(%w[owned_by=foo record_state=true status=open])

      workflow_dashboard = json['data'].find { |d| d['name'] == 'dashboard.workflow' }
      expect(workflow_dashboard['indicators']['workflow']['assessment']['count']).to eq(1)
      expect(workflow_dashboard['indicators']['workflow']['assessment']['query']).to match_array(%w[owned_by=foo record_state=true status=open workflow=assessment])

      reporting_location_dashboard = json['data'].find { |d| d['name'] == 'dashboard.reporting_location' }

      binding.pry
    end
  end

  it 'returns an empty dashboard set if no explicit dashboard authorization' do
    login_for_test(permissions: [])
    get '/api/v2/dashboards'

    expect(response).to have_http_status(200)
    expect(json['data'].size).to eq(0)
  end

  after :each do
    [User, UserGroup, Role, Child, Location].each(&:destroy_all)
    Sunspot.commit
  end

end