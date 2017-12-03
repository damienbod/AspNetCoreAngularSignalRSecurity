using System.Collections.Generic;

namespace ApiServer.SignalRHubs
{
    public class UserInfo
    {
        public string Id { get; set; }
        public List<string> Groups { get; set; }
        public string Name { get; set; }
    }
}
