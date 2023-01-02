using ApiServer.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ApiServer.Controllers;

[AllowAnonymous]
[Route("api/[controller]")]
public class ClientAppSettingsDirectMessageController : Controller
{
    private readonly ClientAppSettingsDirectMessage _clientAppSettings;

    public ClientAppSettingsDirectMessageController(IOptions<ClientAppSettingsDirectMessage> clientAppSettings)
    {
        _clientAppSettings = clientAppSettings.Value;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_clientAppSettings);
    }
}
