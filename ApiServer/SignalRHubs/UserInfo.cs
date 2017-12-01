using System.Collections.Generic;

namespace ApiServer.SignalRHubs
{
    public class UserInfo
    {
        public List<string> Groups { get; set; }
        public string Name { get; set; }
    }
}
