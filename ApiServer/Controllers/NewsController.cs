using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ApiServer.Providers;
using Microsoft.AspNetCore.Authorization;

namespace ApiServer.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]")]
    public class NewsController : Controller
    {
        private NewsStore _newsStore;

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

        public List<string> GetAllGroups()
        {
            var data = _newsStore.GetAllGroups();
            return _newsStore.GetAllGroups();
        }
    }
}
