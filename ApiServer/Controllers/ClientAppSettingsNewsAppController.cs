using ApiServer.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace ApiServer.Controllers;

[AllowAnonymous]
[Route("api/[controller]")]
public class ClientAppSettingsNewsAppController : Controller
{
    private readonly ClientAppSettingsNewsApp _clientAppSettings;

    public ClientAppSettingsNewsAppController(IOptions<ClientAppSettingsNewsApp> clientAppSettings)
    {
        _clientAppSettings = clientAppSettings.Value;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_clientAppSettings);
    }
}
