public void ConfigureServices(IServiceCollection services)
{
 services.AddAuthentication(options =>
{
               options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
               options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
           .AddCookie()
           .AddOpenIdConnect(options =>
           {
               options.ClientId = Configuration["Authentication:AzureAd:ClientId"];
               options.Authority = Configuration["Authentication:AzureAd:AADInstance"] + Configuration["Authentication:AzureAd:TenantId"];
            })
           .AddJwtBearer(options =>
           {
               options.Authority = Configuration["Authentication:AzureAd:AADInstance"] + Configuration["Authentication:AzureAd:TenantId"];
               options.Audience = Configuration["Authentication:AzureAd:Audience"];
               options.Events = new JwtBearerEvents();
               options.Events.OnMessageReceived = context =>
               {
                   StringValues token;
                   if (context.Request.Path.Value.StartsWith("/signalr") && context.Request.Query.TryGetValue("token", out token))
                   {
                       context.Token = token;
                   }

                   return Task.CompletedTask;
               };
           });

services.AddSignalR(options => options.JsonSerializerSettings = new Newtonsoft.Json.JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
services.AddSingleton(typeof(HubLifetimeManager<NotificationHub>), typeof(NotificationHubLifetimeManager<NotificationHub>));

}

public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
app.UseAuthentication();
 app.UseSignalR(routes =>
            {
                routes.MapHub<NotificationHub>("signalr");
            });

            app.UseMvc();

}


---------------

[Authorize(AuthenticationSchemes = " Bearer")]    
    public class NotificationHub: Hub
{
 public async Task Send(string message)
        {
            await Clients.All.InvokeAsync("Send", message);
        }

public override async Task OnConnectedAsync()
        {
...
}

public override async Task OnDisconnectedAsync(Exception exception)
        {
...
}
}


----------------


  public class NotificationHubLifetimeManager<THub> : DefaultHubLifetimeManager<THub>
         where THub : Hub
    {
      
    }

------------

[Authorize(AuthenticationSchemes = "OpenIdConnect, Bearer")]    
 public class TestController : Controller
    {
 public TestController(HubLifetimeManager<NotificationHub> hubManager)
        {
            _hubManager = hubManager;
        }

 [HttpGet("testSig")]
        public async Task Send(string message)
        {
            await _hubManager.InvokeAllAsync("Send", new string[] { "Hello" });
        }
}


----------------

import { Injectable } from '@angular/core';

// these will be added once ng cli will release 1.5
// import { HubConnection, TransportType } from '@aspnet/signalr-client';
// import { IHubConnectionOptions } from '@aspnet/signalr-client/dist/src/IHubConnectionOptions';

declare var signalR: any;

@Injectable()
export class SignalRService {
  // public connection: HubConnection;
  public connection: any;
  public init(url: string, token: string) {

    // const options: IHubConnectionOptions = {
    //   transport: TransportType.WebSockets
    // };

    const options: any = {
      transport: 0
    };
    this.connection = new signalR.HubConnection(url + '?token=' + token, options);
    this.connection.start();
  }

}

--------------------------

Client side with TypeScript in an Angular app:
this._hubConnection = new HubConnection(this._config.SignalRBaseUrl + 'ordersHub' + '?authorization=' + this._securityService.accessToken);
Server with ASP.NET Core 2.0 MVC Web API:

public Task Invoke(HttpContext context)
       {
           var authorizationQueryStringValue = context.Request.Query[_queryStringName];

           if (!string.IsNullOrWhiteSpace(authorizationQueryStringValue) && 
               !context.Request.Headers.ContainsKey(_authorizationHeaderName))
           {
               context.Request.Headers.Append(_authorizationHeaderName, "Bearer " + authorizationQueryStringValue);
           }

           return this._next(context);
       }

@davidfowl
Owner
davidfowl commented 15 days ago • edited

@ChristianWeyer you don't have to transfer the token to a header to make it work, you can do this:

services.AddAuthentication()
    .AddJwtBearer(o =>
    {
        o.Events.OnMessageReceived = context =>
        {
            context.Token = context.HttpContext.Request.Query[_queryStringName];
            return Task.CompletedTask;
        };
    });