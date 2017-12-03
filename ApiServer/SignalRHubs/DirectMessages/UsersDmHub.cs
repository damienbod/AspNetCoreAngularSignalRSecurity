using ApiServer.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApiServer.SignalRHubs
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class UsersDmHub : Hub
    {
        private UserInfoInMemory _userInfoInMemory;

        public UsersDmHub(UserInfoInMemory userInfoInMemory)
        {
            _userInfoInMemory = userInfoInMemory;
        }

        public async Task Join()
        {
            if(_userInfoInMemory.AddUpdate(Context.ConnectionId, "sss", Context.User.Identity.Name))
            {
                // send all online user the new user
                IReadOnlyList<string> list = new List<string>() { Context.ConnectionId };
                await Clients.AllExcept(list).InvokeAsync(
                    "NewOnlineUser",
                    _userInfoInMemory.GetUserInfo(Context.ConnectionId)
                );
            }

            // await Groups.AddAsync(Context.ConnectionId, groupName);

            

            // send the new user all existing users
            await Clients.Client(Context.ConnectionId).InvokeAsync(
                "OnlineUsers",
                _userInfoInMemory.GetAllExceptUser(Context.ConnectionId)
            );
        }

        public Task SendDirectMessage(string message, string targetUserId)
        {
            var userInfoSender = _userInfoInMemory.GetUserInfo(Context.ConnectionId);
            return Clients.Client(targetUserId).InvokeAsync("SendDM", message, userInfoSender);
        }
    }
}
