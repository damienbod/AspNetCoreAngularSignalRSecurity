using Microsoft.AspNetCore.Mvc;
using ApiServer.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace ApiServer.Controllers;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/[controller]")]
public class NewsController : Controller
{
    private readonly NewsStore _newsStore;

    public NewsController(NewsStore newsStore)
    {
        _newsStore = newsStore;
    }

    [HttpPost]
    public IActionResult AddGroup([FromQuery] string group)
    {
        if (string.IsNullOrEmpty(group))
        {
            return BadRequest();
        }

        _newsStore.AddGroup(group);

        return Created("AddGroup", group);
    }

    [HttpGet]
    [Route("")]
    public List<string> GetAllGroups()
    {
        return _newsStore.GetAllGroups();
    }
}
