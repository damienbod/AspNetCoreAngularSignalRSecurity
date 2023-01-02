namespace ApiServer.Model;

public class ClientAppSettings
{
    public string stsServer { get; set; } = string.Empty;
    public string redirect_url { get; set; } = string.Empty;
    public string client_id { get; set; } = string.Empty;
    public string response_type { get; set; } = string.Empty;
    public string scope { get; set; } = string.Empty;
    public string post_logout_redirect_uri { get; set; } = string.Empty;
    public bool start_checksession { get; set; }
    public bool silent_renew { get; set; }
    public string startup_route { get; set; } = string.Empty;
    public string forbidden_route { get; set; } = string.Empty;
    public string unauthorized_route { get; set; } = string.Empty;
    public bool log_console_warning_active { get; set; }
    public bool log_console_debug_active { get; set; }
    public string max_id_token_iat_offset_allowed_in_seconds { get; set; } = string.Empty;
    public string apiServer { get; set; } = string.Empty;
}
