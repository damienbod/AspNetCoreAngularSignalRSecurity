using System.Collections.Concurrent;
using System.Collections.Generic;

namespace ApiServer.SignalRHubs
{
    public class UserInfoInMemory
    {
        private ConcurrentDictionary<string, UserInfo> _onlineUser { get; set; } = new ConcurrentDictionary<string, UserInfo>();

        public void AddUpdate(string key, string groupName, string name)
        {
            var userInfo = _onlineUser.GetOrAdd(key, new UserInfo
            {
                Name = name,
                Groups = new List<string> { groupName }

            });

            if (!userInfo.Groups.Contains(groupName))
            {
                userInfo.Groups.Add(groupName);
            }
        }
    }
}
