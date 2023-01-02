using System.Collections.Concurrent;

namespace ApiServer.SignalRHubs;

public class UserInfoInMemory
{
    private readonly ConcurrentDictionary<string, UserInfo> _onlineUser = new();

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

        throw new ArgumentNullException(nameof(name));
    }

    public void Remove(string? name)
    {
        if(!string.IsNullOrEmpty(name))
        {
            _onlineUser.TryRemove(name, out _);
        }
    }

    public IEnumerable<UserInfo> GetAllUsersExceptThis(string? username)
    {
        if(!string.IsNullOrEmpty(username))
            return new List<UserInfo>();

        return _onlineUser.Values.Where(item => item.UserName != username);
    }

    public UserInfo GetUserInfo(string? username)
    {
        if (!string.IsNullOrEmpty(username))
        {
            _onlineUser.TryGetValue(username, out UserInfo? userInfo);
            if(userInfo != null)
                return userInfo;
        }

        throw new ArgumentNullException(nameof(username));
    }
}
