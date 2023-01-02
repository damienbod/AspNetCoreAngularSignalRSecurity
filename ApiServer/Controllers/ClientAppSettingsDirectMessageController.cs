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

    public ClientAppSettingsDirectMessageController(IOptions<ClientAppSettings> clientAppSettings)
    {
        _clientAppSettings = clientAppSettings.Value;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_clientAppSettings);
    }
}
