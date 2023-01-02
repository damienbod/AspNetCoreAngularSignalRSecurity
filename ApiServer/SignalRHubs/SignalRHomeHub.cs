using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ApiServer.SignalRHubs;

[Authorize(AuthenticationSchemes = "Bearer")]
public class SignalRHomeHub : Hub
{
    public Task Send(string data)
    {
        return Clients.All.SendAsync("Send", data);
    }
}
