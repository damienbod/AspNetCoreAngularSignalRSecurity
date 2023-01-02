using ApiServer.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace ApiServer.Controllers;

[AllowAnonymous]
[Route("api/[controller]")]
public class ClientAppSettingsNewsAppController : Controller
{
    private readonly ClientAppSettings _clientAppSettings;

    public ClientAppSettingsNewsAppController(IOptionsMonitor<ClientAppSettings> clientAppSettings)
    {
        _clientAppSettings = clientAppSettings.Get("NEWS");
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_clientAppSettings);
    }
}
