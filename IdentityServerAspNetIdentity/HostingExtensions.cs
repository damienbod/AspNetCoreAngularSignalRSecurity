using Fido2NetLib;
using IdentityServerAspNetIdentity.Data;
using IdentityServerHost.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace IdentityServerAspNetIdentity;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder =>
                {
                    builder
                        .AllowCredentials()
                        .WithOrigins(
                            "https://localhost:44311", 
                            "https://localhost:44390", 
                            "https://localhost:44395", 
                            "https://localhost:44318")
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders()
            .AddTokenProvider<Fido2UserTwoFactorTokenProvider>("FIDO2");

        builder.Services.Configure<Fido2Configuration>(builder.Configuration.GetSection("fido2"));
        builder.Services.AddScoped<Fido2Store>();

        // Adds a default in-memory implementation of IDistributedCache.
        builder.Services.AddDistributedMemoryCache();
        builder.Services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromMinutes(2);
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        });

        builder.Services
            .AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                options.EmitStaticAudienceClaim = true;
            })
            .AddInMemoryIdentityResources(Config.IdentityResources)
            .AddInMemoryApiScopes(Config.ApiScopes)
            .AddInMemoryClients(Config.Clients)
            .AddInMemoryApiResources(Config.ApiResources)
            .AddAspNetIdentity<ApplicationUser>()
            .AddProfileService<IdentityWithAdditionalClaimsProfileService>();

        builder.Services.AddAuthentication();

        return builder.Build();
    }
    
    public static WebApplication ConfigurePipeline(this WebApplication app)
    { 
        app.UseSerilogRequestLogging();
    
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors("AllowAllOrigins");

        app.UseStaticFiles();
        app.UseRouting();

        app.UseIdentityServer();
        app.UseAuthorization();
        
        app.MapRazorPages().RequireAuthorization();

        app.MapControllers();

        app.UseSession();

        return app;
    }
}