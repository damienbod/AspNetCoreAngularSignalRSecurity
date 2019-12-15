using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IdentityServer4.Services;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using Microsoft.AspNetCore.Identity;
using System.Globalization;
using System.Collections.Generic;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Options;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using System;
using StsServerIdentity.Services.Certificate;
using StsServerIdentity.Models;
using StsServerIdentity.Data;
using StsServerIdentity.Resources;
using StsServerIdentity.Services;
using Microsoft.IdentityModel.Tokens;
using StsServerIdentity.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace StsServerIdentity
{
    public class Startup
    {
        private string _clientId = "xxxxxx";
        private string _clientSecret = "xxxxx";
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _environment = env;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment _environment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var stsConfig = Configuration.GetSection("StsConfig");
            _clientId = Configuration["MicrosoftClientId"];
            _clientSecret = Configuration["MircosoftClientSecret"];

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            services.Configure<StsConfig>(Configuration.GetSection("StsConfig"));
            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.AddTransient<IProfileService, IdentityWithAdditionalClaimsProfileService>();
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddSingleton<IAuthorizationHandler, IsAdminHandler>();

            X509Certificate2 cert = GetCertificate(_environment, Configuration);

            AddLocalizationConfigurations(services);

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder
                            .AllowCredentials()
                            .WithOrigins("https://localhost:44311", "https://localhost:44390", "https://localhost:44395", "https://localhost:44318")
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            services.AddIdentity<ApplicationUser, IdentityRole>()
               .AddEntityFrameworkStores<ApplicationDbContext>()
               .AddErrorDescriber<StsIdentityErrorDescriber>()
               .AddDefaultTokenProviders();

            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AdditionalUserClaimsPrincipalFactory>();

            services.AddAuthentication()
                 .AddOpenIdConnect("aad", "Login with Azure AD", options =>
                 {
                     options.Authority = $"https://login.microsoftonline.com/common";
                     options.TokenValidationParameters = new TokenValidationParameters { ValidateIssuer = false };
                     options.ClientId = "99eb0b9d-ca40-476e-b5ac-6f4c32bfb530";
                     options.CallbackPath = "/signin-oidc";
                 });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("IsAdmin", policyIsAdminRequirement =>
                {
                    policyIsAdminRequirement.Requirements.Add(new IsAdminRequirement());
                });
            });

            services.AddControllersWithViews(options =>
                {
                    options.Filters.Add(new SecurityHeadersAttribute());
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                .AddViewLocalization()
                .AddDataAnnotationsLocalization(options =>
                {
                    options.DataAnnotationLocalizerProvider = (type, factory) =>
                    {
                        var assemblyName = new AssemblyName(typeof(SharedResource).GetTypeInfo().Assembly.FullName);
                        return factory.Create("SharedResource", assemblyName.Name);
                    };
                });

            services.AddIdentityServer()
                .AddSigningCredential(cert)
                .AddInMemoryIdentityResources(Config.GetIdentityResources())
                .AddInMemoryApiResources(Config.GetApiResources())
                .AddInMemoryClients(Config.GetClients())
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<IdentityWithAdditionalClaimsProfileService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts(hsts => hsts.MaxAge(365).IncludeSubdomains());
            }

            app.UseCors("AllowAllOrigins");

            app.UseHsts(hsts => hsts.MaxAge(365).IncludeSubdomains());
            //app.UseXContentTypeOptions();
            //app.UseReferrerPolicy(opts => opts.NoReferrer());
            //app.UseXXssProtection(options => options.EnabledWithBlockMode());

            var stsConfig = Configuration.GetSection("StsConfig");
            var angularClient2Url = stsConfig["AngularClient2Url"];
            var angularClientUrl = stsConfig["AngularClientUrl"];

            app.UseCsp(opts => opts
                .BlockAllMixedContent()
                .StyleSources(s => s.Self())
                .StyleSources(s => s.UnsafeInline())
                .FontSources(s => s.Self())
                .FrameAncestors(s => s.Self())
                .FrameAncestors(s => s.CustomSources(
                   "https://localhost:44311", "https://localhost:44390", "https://localhost:44395", "https://localhost:44318")
                 )
                .ImageSources(imageSrc => imageSrc.Self())
                .ImageSources(imageSrc => imageSrc.CustomSources("data:"))
                .ScriptSources(s => s.Self())
                .ScriptSources(s => s.UnsafeInline())
            );

            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);

            // https://nblumhardt.com/2019/10/serilog-in-aspnetcore-3/
            // https://nblumhardt.com/2019/10/serilog-mvc-logging/
            app.UseSerilogRequestLogging();

            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = context =>
                {
                    if (context.Context.Response.Headers["feature-policy"].Count == 0)
                    {
                        var featurePolicy = "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'";

                        context.Context.Response.Headers["feature-policy"] = featurePolicy;
                    }

                    if (context.Context.Response.Headers["X-Content-Security-Policy"].Count == 0)
                    {
                        var csp = "script-src 'self';style-src 'self';img-src 'self' data:;font-src 'self';form-action 'self';frame-ancestors 'self';block-all-mixed-content";
                        // IE
                        context.Context.Response.Headers["X-Content-Security-Policy"] = csp;
                    }
                }
            });

            app.UseRouting();

            app.UseIdentityServer();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        private static X509Certificate2 GetCertificate(IWebHostEnvironment environment, IConfiguration configuration)
        {
            X509Certificate2 cert;
            var useLocalCertStore = Convert.ToBoolean(configuration["UseLocalCertStore"]);
            var certificateThumbprint = configuration["CertificateThumbprint"];

            if (environment.IsProduction())
            {
                if (useLocalCertStore)
                {
                    using (X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine))
                    {
                        store.Open(OpenFlags.ReadOnly);
                        var certs = store.Certificates.Find(X509FindType.FindByThumbprint, certificateThumbprint, false);
                        cert = certs[0];
                        store.Close();
                    }
                }
                else
                {
                    // Azure deployment, will be used if deployed to Azure
                    var vaultConfigSection = configuration.GetSection("Vault");
                    var keyVaultService = new KeyVaultCertificateService(vaultConfigSection["Url"], vaultConfigSection["ClientId"], vaultConfigSection["ClientSecret"]);
                    cert = keyVaultService.GetCertificateFromKeyVault(vaultConfigSection["CertificateName"]);
                }
            }
            else
            {
                cert = new X509Certificate2(Path.Combine(environment.ContentRootPath, "sts_dev_cert.pfx"), "1234");
            }

            return cert;
        }

        private static void AddLocalizationConfigurations(IServiceCollection services)
        {
            services.AddSingleton<LocService>();
            services.AddLocalization(options => options.ResourcesPath = "Resources");

            services.Configure<RequestLocalizationOptions>(
                options =>
                {
                    var supportedCultures = new List<CultureInfo>
                        {
                            new CultureInfo("en-US"),
                            new CultureInfo("de-DE"),
                            new CultureInfo("de-CH"),
                            new CultureInfo("it-IT"),
                            new CultureInfo("gsw-CH"),
                            new CultureInfo("fr-FR"),
                            new CultureInfo("zh-Hans")
                        };

                    options.DefaultRequestCulture = new RequestCulture(culture: "de-DE", uiCulture: "de-DE");
                    options.SupportedCultures = supportedCultures;
                    options.SupportedUICultures = supportedCultures;

                    var providerQuery = new LocalizationQueryProvider
                    {
                        QueryParameterName = "ui_locales"
                    };

                    options.RequestCultureProviders.Insert(0, providerQuery);
                });
        }
    }
}
