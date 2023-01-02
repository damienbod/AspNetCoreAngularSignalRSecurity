using ApiServer.Model;
using Microsoft.AspNetCore.Mvc;
using ApiServer.Data;

namespace ApiServer.Repositories;

public class DataEventRecordRepository
{
    private readonly DataEventRecordContext _context;
    private readonly ILogger _logger;

    public DataEventRecordRepository(DataEventRecordContext context, ILoggerFactory loggerFactory)
    {
        _context = context;
        _logger = loggerFactory.CreateLogger("DataEventRecordResporitory");
    }

    public IEnumerable<DataEventRecordDto> GetAll(string username)
    {
        _logger.LogInformation("Getting a the existing records");

        return _context.DataEventRecords.Where(item => item.Username == username).Select(z =>
            new DataEventRecordDto
            {
                Name = z.Name,
                Description = z.Description,
                Timestamp = z.Timestamp,
                Id = z.Id
            });
    }

    public DataEventRecordDto Get(int id)
    {
        var dataEventRecord = _context.DataEventRecords.Select(z =>
            new DataEventRecordDto
            {
                Name = z.Name,
                Description = z.Description,
                Timestamp = z.Timestamp,
                Id = z.Id
            }).First(t => t.Id == id);
        return dataEventRecord;
    }


    public string GetUsername(int id)
    {
        var data = _context.DataEventRecords.First(t => t.Id == id);
        return data.Username;
    }

    [HttpPost]
    public void Post(DataEventRecordDto dataEventRecord, string username)
    {
        _context.DataEventRecords.Add(new DataEventRecord
        {
            Name = dataEventRecord.Name,
            Description = dataEventRecord.Description,
            Timestamp = DateTime.UtcNow.ToString("O"),
            Id = dataEventRecord.Id,
            Username = username
        });
        _context.SaveChanges();
    }

    public void Put(int id, DataEventRecordDto dataEventRecordDto)
    {
        var dataEventRecord = _context.DataEventRecords.First(t => t.Id == id);
        dataEventRecord.Name = dataEventRecordDto.Name;
        dataEventRecord.Description = dataEventRecordDto.Description;
        dataEventRecord.Timestamp = DateTime.UtcNow.ToString("O");

        _context.DataEventRecords.Update(dataEventRecord);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var entity = _context.DataEventRecords.First(t => t.Id == id);
        _context.DataEventRecords.Remove(entity);
        _context.SaveChanges();
    }
}
