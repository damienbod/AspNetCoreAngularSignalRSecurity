using System.Collections.Generic;
using System.Threading.Tasks;
using ApiServer.Model;

namespace ApiServer.Repositories
{
    public interface IDataEventRecordRepository
    {
        void Delete(long id);
        DataEventRecordDto Get(long id);
        IEnumerable<DataEventRecordDto> GetAll(string username);
        void Post(DataEventRecordDto dataEventRecord, string username);
        void Put(long id, DataEventRecordDto dataEventRecord);
        string GetUsername(long dataEventRecordId);
    }
}