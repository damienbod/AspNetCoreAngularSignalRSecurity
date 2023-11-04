using ApiServer.Data;
using ApiServer.Model;
using ApiServer.Providers;
using ApiServer.Repositories;
using ApiServer.SignalRHubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
namespace StsServerIdentity;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;

        services.Configure<ClientAppSettings>("NEWS", configuration.GetSection("ClientAppSettingsNewsApp"));
        services.Configure<ClientAppSettings>("DM", configuration.GetSection("ClientAppSettingsDirectMessage"));

        services.AddTransient<DataEventRecordRepository>();
        services.AddSingleton<NewsStore>();
        services.AddSingleton<UserInfoInMemory>();

        var defaultConnection = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<NewsContext>(options =>
            options.UseSqlite(defaultConnection),
            ServiceLifetime.Singleton
        );

        var sqliteConnectionString = configuration.GetConnectionString("SqliteConnectionString");
        services.AddDbContext<DataEventRecordContext>(options =>
            options.UseSqlite(sqliteConnectionString)
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
                        .WithOrigins(
                            "https://localhost:44311",
                            "https://localhost:44390",
                            "https://localhost:44395",
                            "https://localhost:5001");
                });
        });

        var guestPolicy = new AuthorizationPolicyBuilder()
            .RequireClaim("scope", "dataEventRecords")
            .Build();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = "https://localhost:5001/";
                options.Audience = "dataEventRecordsApi";
                options.IncludeErrorDetails = true;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    NameClaimType = "email",
                    RoleClaimType = "role",
                    ValidAudiences = new List<string> { "dataEventRecordsApi" },
                    ValidIssuers = new List<string> { "https://localhost:5001/" }
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if ((context.Request.Path.Value!.StartsWith("/signalrhome")
                            || context.Request.Path.Value!.StartsWith("/looney")
                            || context.Request.Path.Value!.StartsWith("/usersdm")
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
        services.AddControllers();

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
                {securityScheme, Array.Empty<string>()}
            });

            c.SwaggerDoc("v1", new OpenApiInfo { Title = "APIs", Version = "v1" });
        });

        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        IdentityModelEventSource.ShowPII = true;
        app.UseSerilogRequestLogging();

        app.UseDeveloperExceptionPage();

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "APIs");
            c.RoutePrefix = string.Empty;
        });

        app.UseCors("AllowMyOrigins");

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapHub<UsersDmHub>("/usersdm");
        app.MapHub<SignalRHomeHub>("/signalrhome");
        app.MapHub<NewsHub>("/looney");
        app.MapControllers();

        return app;
    }
}