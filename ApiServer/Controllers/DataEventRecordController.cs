using ApiServer.Model;
using ApiServer.Repositories;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiServer.Controllers;

[Authorize(AuthenticationSchemes = "Bearer")]
[Route("api/[controller]")]
public class DataEventRecordsController : Controller
{
    private readonly DataEventRecordRepository _dataEventRecordRepository;

    public DataEventRecordsController(DataEventRecordRepository dataEventRecordRepository)
    {
        _dataEventRecordRepository = dataEventRecordRepository;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var username = HttpContext.User.FindFirst("name").Value;
        return Ok(_dataEventRecordRepository.GetAll(username));
    }

    [HttpGet("{id}")]
    public IActionResult Get(long id)
    {
        return Ok(_dataEventRecordRepository.Get(id));
    }

    [HttpPost]
    public IActionResult Post([FromBody]DataEventRecordDto value)
    {
        var username = HttpContext.User.FindFirst("name").Value;
        _dataEventRecordRepository.Post(value, username);
        return Created("/api/DataEventRecords", value);
    }

    [HttpPut("{id}")]
    public IActionResult Put(long id, [FromBody]DataEventRecordDto dataEventRecordDto)
    {
        _dataEventRecordRepository.Put(id, dataEventRecordDto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(long id)
    {
        _dataEventRecordRepository.Delete(id);
        return NoContent();
    }
}
