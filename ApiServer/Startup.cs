using ApiServer.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using IdentityServer4.AccessTokenValidation;
using ApiServer.Policies;
using ApiServer.Providers;
using ApiServer.SignalRHubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Primitives;
using System.Threading.Tasks;
using ApiServer.Data;
using Serilog;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;

namespace ApiServer
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }
        
        private IHostingEnvironment _env { get; set; }

        public Startup(IHostingEnvironment env)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Verbose()
                .Enrich.WithProperty("App", "ApiServer")
                .Enrich.FromLogContext()
                .WriteTo.Seq("http://localhost:5341")
                .WriteTo.RollingFile("../Logs/ApiServer")
                .CreateLogger();

            _env = env;
            var builder = new ConfigurationBuilder()
                 .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json");
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var sqliteConnectionString = Configuration.GetConnectionString("SqliteConnectionString");
            var defaultConnection = Configuration.GetConnectionString("DefaultConnection");

            var cert = new X509Certificate2(Path.Combine(_env.ContentRootPath, "damienbodserver.pfx"), "");

            services.AddDbContext<DataEventRecordContext>(options =>
                options.UseSqlite(sqliteConnectionString)
            );

            // used for the new items which belong to the signalr hub
            services.AddDbContext<NewsContext>(options =>
                options.UseSqlite(
                    defaultConnection
                ), ServiceLifetime.Singleton
            );

            services.AddSingleton<IAuthorizationHandler, CorrectUserHandler>();
            services.AddSingleton<NewsStore>();
            services.AddSingleton<UserInfoInMemory>();

            var policy = new Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicy();
            policy.Headers.Add("*");
            policy.Methods.Add("*");
            policy.Origins.Add("*");
            policy.SupportsCredentials = true;

            services.AddCors(x => x.AddPolicy("corsGlobalPolicy", policy));

            var guestPolicy = new AuthorizationPolicyBuilder()
                .RequireClaim("scope", "dataEventRecords")
                .Build();

            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidIssuer = "https://localhost:44318/",
                ValidAudience = "dataEventRecords",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("dataEventRecordsSecret")),
                NameClaimType = "name",
                RoleClaimType = "role", 
            };

            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler
            {
                InboundClaimTypeMap = new Dictionary<string, string>()
            };

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = "https://localhost:44318/";
                options.Audience = "dataEventRecords";
                options.IncludeErrorDetails = true;
                options.SaveToken = true;
                options.SecurityTokenValidators.Clear();
                options.SecurityTokenValidators.Add(jwtSecurityTokenHandler);
                options.TokenValidationParameters = tokenValidationParameters;
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if ( ( context.Request.Path.Value.StartsWith("/signalrhome")
                            || context.Request.Path.Value.StartsWith("/looney")
                            || context.Request.Path.Value.StartsWith("/usersdm") 
                           )
                            && context.Request.Query.TryGetValue("token", out StringValues token)
                        )
                        {
                            context.Token = token;
                        }

                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        var te = context.Exception;
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("dataEventRecordsAdmin", policyAdmin =>
                {
                    policyAdmin.RequireClaim("role", "dataEventRecords.admin");
                });
                options.AddPolicy("dataEventRecordsUser", policyUser =>
                {
                    policyUser.RequireClaim("role", "dataEventRecords.user");
                });
                options.AddPolicy("dataEventRecords", policyUser =>
                {
                    policyUser.RequireClaim("scope", "dataEventRecords");
                });
                options.AddPolicy("correctUser", policyCorrectUser =>
                {
                    policyCorrectUser.Requirements.Add(new CorrectUserRequirement());
                });
            });

            services.AddSignalR();

            services.AddMvc(options =>
            {
               //options.Filters.Add(new AuthorizeFilter(guestPolicy));
            }).AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

            services.AddScoped<IDataEventRecordRepository, DataEventRecordRepository>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();
            loggerFactory.AddDebug();

            loggerFactory.AddSerilog();

            app.UseExceptionHandler("/Home/Error");
            app.UseCors("corsGlobalPolicy");
            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseSignalR(routes =>
            {
                routes.MapHub<UsersDmHub>("usersdm");
                routes.MapHub<SignalRHomeHub>("signalrhome");
                routes.MapHub<NewsHub>("looney");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
