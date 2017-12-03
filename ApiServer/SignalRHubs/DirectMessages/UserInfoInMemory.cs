using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace ApiServer.SignalRHubs
{
    public class UserInfoInMemory
    {
        private ConcurrentDictionary<string, UserInfo> _onlineUser { get; set; } = new ConcurrentDictionary<string, UserInfo>();

        public bool AddUpdate(string id, string groupName, string name)
        {
            var userAlreadyExists = _onlineUser.ContainsKey(id);
            var userInfo = _onlineUser.GetOrAdd(id, new UserInfo
            {
                Id = id,
                Name = name,
                Groups = new List<string> { groupName }

            });

            if (!userInfo.Groups.Contains(groupName))
            {
                userInfo.Groups.Add(groupName);
            }

            return userAlreadyExists;
        }

        public IEnumerable<UserInfo> GetAllExceptUser(string id)
        {
            return _onlineUser.Values.Where(item => item.Id != id);
        }

        public UserInfo GetUserInfo(string id)
        {
            UserInfo user;
            _onlineUser.TryGetValue(id, out user);
            return user;
        }
    }
}
