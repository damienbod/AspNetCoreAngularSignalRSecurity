using ApiServer.SignalRHubs;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ApiServer.Providers;

namespace ApiServer.Controllers
{
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
            return _newsStore.GetAllGroups();
        }
    }
}
