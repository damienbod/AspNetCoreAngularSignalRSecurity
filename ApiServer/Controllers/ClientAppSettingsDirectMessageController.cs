using ApiServer.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ApiServer.Controllers;

[AllowAnonymous]
[Route("api/[controller]")]
public class ClientAppSettingsDirectMessageController : Controller
{
    private readonly ClientAppSettings _clientAppSettings;

    public ClientAppSettingsDirectMessageController(IOptionsMonitor<ClientAppSettings> clientAppSettings)
    {
        _clientAppSettings = clientAppSettings.Get("DM");
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_clientAppSettings);
    }
}
