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
using ApiServer.Providers;
using ApiServer.SignalRHubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Primitives;
using System.Threading.Tasks;
using ApiServer.Data;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ApiServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            Configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        public IConfiguration Configuration { get; }

        private readonly IWebHostEnvironment _webHostEnvironment;

        public void ConfigureServices(IServiceCollection services)
        {
            var sqliteConnectionString = Configuration.GetConnectionString("SqliteConnectionString");
            var defaultConnection = Configuration.GetConnectionString("DefaultConnection");
			
            services.AddDbContext<DataEventRecordContext>(options =>
                options.UseSqlite(sqliteConnectionString)
            );

            services.AddDbContext<NewsContext>(options =>
                options.UseSqlite(
                    defaultConnection
                ), ServiceLifetime.Singleton
            );

            services.AddSingleton<NewsStore>();
            services.AddSingleton<UserInfoInMemory>();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowMyOrigins",
                    builder =>
                    {
                        builder
                            .AllowCredentials()
                            .AllowAnyHeader()
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .AllowAnyMethod()
                            .WithOrigins("https://localhost:44311", "https://localhost:44390", "https://localhost:44395", "https://localhost:44318");
                    });
            });

            var guestPolicy = new AuthorizationPolicyBuilder()
                .RequireClaim("scope", "dataEventRecords")
                .Build();

            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidIssuer = "https://localhost:44318/",
                ValidAudience = "dataEventRecords",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("dataEventRecordsSecret")),
                NameClaimType = "email",
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

            services.AddAuthorization(options => { });

            services.AddSignalR();

            services.AddControllers()
                .AddNewtonsoftJson()
                .AddJsonOptions(options =>
                {
                    //options.JsonSerializerOptions.ContractResolver = new DefaultContractResolver();
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
           

            services.AddTransient<IDataEventRecordRepository, DataEventRecordRepository>();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseCors("AllowMyOrigins");

            app.UseExceptionHandler("/Home/Error");
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<UsersDmHub>("/usersdm");
                endpoints.MapHub<SignalRHomeHub>("/signalrhome");
                endpoints.MapHub<NewsHub>("/looney");

                endpoints.MapControllers();
            });
        }
    }
}
