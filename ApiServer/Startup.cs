using ApiServer.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
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
using Serilog;
using Microsoft.OpenApi.Models;

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
            //JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            //IdentityModelEventSource.ShowPII = true;
            //JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

            services.AddTransient<IDataEventRecordRepository, DataEventRecordRepository>();
            services.AddSingleton<NewsStore>();
            services.AddSingleton<UserInfoInMemory>();

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
                ValidAudience = "dataEventRecordsApi",
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
                options.Audience = "dataEventRecordsApi";
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

            services.AddAuthorization();

            services.AddSignalR();

            services.AddControllers()
                .AddNewtonsoftJson();
 
            services.AddSwaggerGen(c =>
            {
                // add JWT Authentication
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "JWT Authentication",
                    Description = "Enter JWT Bearer token **_only_**",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer", // must be lower case
                    BearerFormat = "JWT",
                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };
                c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {securityScheme, new string[] { }}
                });

                c.SwaggerDoc("v1", new OpenApiInfo { Title = "APIs", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseDeveloperExceptionPage();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "APIs");
                c.RoutePrefix = string.Empty;
            });

            app.UseCors("AllowMyOrigins");

            // https://nblumhardt.com/2019/10/serilog-in-aspnetcore-3/
            // https://nblumhardt.com/2019/10/serilog-mvc-logging/
            app.UseSerilogRequestLogging();

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
