using ApiServer.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApiServer.SignalRHubs
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class NewsHub : Hub
    {
        private NewsStore _newsStore;
        private UserInfoInMemory _userInfoInMemory;

        public NewsHub(NewsStore newsStore, UserInfoInMemory userInfoInMemory)
        {
            _userInfoInMemory = userInfoInMemory;
            _newsStore = newsStore;
        }

        public Task Send(NewsItem newsItem)
        {
            if(!_newsStore.GroupExists(newsItem.NewsGroup))
            {
                throw new System.Exception("cannot send a news item to a group which does not exist.");
            }

            _newsStore.CreateNewItem(newsItem);
            return Clients.Group(newsItem.NewsGroup).InvokeAsync("Send", newsItem);
        }

        public async Task JoinGroup(string groupName)
        {
            if (!_newsStore.GroupExists(groupName))
            {
                throw new System.Exception("cannot join a group which does not exist.");
            }

            if(_userInfoInMemory.AddUpdate(Context.ConnectionId, groupName, Context.User.Identity.Name))
            {
                // send all online user the new user
                IReadOnlyList<string> list = new List<string>() { Context.ConnectionId };
                await Clients.AllExcept(list).InvokeAsync(
                    "NewOnlineUser",
                    _userInfoInMemory.GetUserInfo(Context.ConnectionId)
                );
            }

            await Groups.AddAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).InvokeAsync("JoinGroup", groupName);

            var history = _newsStore.GetAllNewsItems(groupName);
            await Clients.Client(Context.ConnectionId).InvokeAsync("History", history);

            

            // send the new user all existing users
            await Clients.Client(Context.ConnectionId).InvokeAsync(
                "OnlineUsers",
                _userInfoInMemory.GetAllExceptUser(Context.ConnectionId)
            );
        }

        public async Task LeaveGroup(string groupName)
        {
            if (!_newsStore.GroupExists(groupName))
            {
                throw new System.Exception("cannot leave a group which does not exist.");
            }

            await Clients.Group(groupName).InvokeAsync("LeaveGroup", groupName);
            await Groups.RemoveAsync(Context.ConnectionId, groupName);
        }

        public Task SendDirectMessage(string message, string targetUserId)
        {
            return Clients.Client(targetUserId).InvokeAsync("SendDM", message);
        }
    }
}
