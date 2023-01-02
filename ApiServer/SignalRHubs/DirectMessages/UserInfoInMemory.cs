using System.Collections.Concurrent;

namespace ApiServer.SignalRHubs;

public class UserInfoInMemory
{
    private ConcurrentDictionary<string, UserInfo> _onlineUser { get; set; } = new ConcurrentDictionary<string, UserInfo>();

    public bool AddUpdate(string? name, string connectionId)
    {
        if (!string.IsNullOrEmpty(name))
        {
            var userAlreadyExists = _onlineUser.ContainsKey(name);

            var userInfo = new UserInfo
            {
                UserName = name,
                ConnectionId = connectionId
            };

            _onlineUser.AddOrUpdate(name, userInfo, (key, value) => userInfo);

            return userAlreadyExists;
        }

        throw new ArgumentNullException("name is null");
    }

    public void Remove(string? name)
    {
        if(!string.IsNullOrEmpty(name))
        {
            _onlineUser.TryRemove(name, out _);
        }
    }

    public IEnumerable<UserInfo> GetAllUsersExceptThis(string username)
    {
        return _onlineUser.Values.Where(item => item.UserName != username);
    }

    public UserInfo GetUserInfo(string? username)
    {
        if (!string.IsNullOrEmpty(username))
        {
            _onlineUser.TryGetValue(username, out UserInfo? userInfo);
            return userInfo;
        }

        throw new ArgumentNullException("username is null");
    }
}
