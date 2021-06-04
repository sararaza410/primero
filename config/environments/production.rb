Primero::Application.configure do
  # The production environment is meant for finished, "live" apps.
  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Specifies the header that your server uses for sending files
  config.action_dispatch.x_sendfile_header = "X-Sendfile"

  # Disable Rails's static asset server
  # In production, Apache or nginx will already do this
  config.public_file_server.enabled = false
  # config.serve_static_files = false

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  # Asset pipeline
  config.assets.compress = true
  config.assets.compile = true
  config.assets.digest = true
  config.assets.js_compressor = Closure::Compiler.new
  config.assets.css_compressor = :yui
  config.assets.cache_store = :memory_store

  config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect'

  config.assets.paths << Rails.root.join("vendor", "assets")

  config.assets.precompile += %w( jplayer.blue.monday.css **.jpg **.png )

  config.eager_load = true

  config.filter_parameters += [:child, :incident, :tracing_request]

  config.log_level = :debug

  config.action_mailer.default_url_options = { host: "https://primerouat.septemsystems.com/" }

  # WARNING **
  # NEVER UNSET THIS OR YOU WILL BREAK THINGS!
  # config.force_ssl = true
end
