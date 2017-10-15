using ApiServer.Model;
using ApiServer.Repositories;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiServer.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Authorize("dataEventRecords")]
    [Route("api/[controller]")]
    public class DataEventRecordsController : Controller
    {
        private readonly IDataEventRecordRepository _dataEventRecordRepository;

        public DataEventRecordsController(IDataEventRecordRepository dataEventRecordRepository)
        {
            _dataEventRecordRepository = dataEventRecordRepository;
        }

        [Authorize("dataEventRecordsUser")]
        [HttpGet]
        public IActionResult Get()
        {
            var username = HttpContext.User.FindFirst("name").Value;
            return Ok(_dataEventRecordRepository.GetAll(username));
        }

        //[Authorize("correctUser")]
        [Authorize("dataEventRecordsAdmin")]
        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            return Ok(_dataEventRecordRepository.Get(id));
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpPost]
        public IActionResult Post([FromBody]DataEventRecordDto value)
        {
            var username = HttpContext.User.FindFirst("name").Value;
            _dataEventRecordRepository.Post(value, username);
            return Created("/api/DataEventRecords", value);
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpPut("{id}")]
        public IActionResult Put(long id, [FromBody]DataEventRecordDto value)
        {
            _dataEventRecordRepository.Put(id, value);
            return NoContent();
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            _dataEventRecordRepository.Delete(id);
            return NoContent();
        }
    }
}
