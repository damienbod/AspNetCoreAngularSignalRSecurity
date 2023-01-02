using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ApiServer.SignalRHubs;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class SignalRHomeHub : Hub
{
    public Task Send(string data)
    {
        return Clients.All.SendAsync("Send", data);
    }
}
