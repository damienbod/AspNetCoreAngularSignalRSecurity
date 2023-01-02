using Microsoft.AspNetCore.Mvc;
using ApiServer.Providers;
using Microsoft.AspNetCore.Authorization;

namespace ApiServer.Controllers;

[Authorize(AuthenticationSchemes = "Bearer")]
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
