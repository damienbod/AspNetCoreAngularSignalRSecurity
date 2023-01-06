using Duende.IdentityServer;
using Duende.IdentityServer.Models;

namespace IdentityServerAspNetIdentity;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
            new IdentityResource("dataeventrecordsir",new []{ "role", "admin", "user", "dataEventRecords", "dataEventRecords.admin" , "dataEventRecords.user" } ),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("dataEventRecords", "Scope for the dataEventRecords ApiResource",
                    new List<string> {
                        "role",
                        "admin",
                        "user",
                        "dataEventRecords",
                        "dataEventRecords.admin",
                        "dataEventRecords.user"
                    }
            )
        };

    //public static IEnumerable<ApiResource> GetApiResources()
    //{
    //    return new List<ApiResource>
    //    {
    //        new ApiResource("dataEventRecordsApi")
    //        {
    //            ApiSecrets =
    //            {
    //                new Secret("dataEventRecordsSecret".Sha256())
    //            },
    //            Scopes = new List<string> { "dataEventRecords" }
    //        }
    //    };
    //}

    public static IEnumerable<Client> Clients => new Client[]
    {
        new Client
        {
            ClientName = "angularclient",
            ClientId = "angularclient",
            AccessTokenType = AccessTokenType.Jwt,
            AccessTokenLifetime = 3300,// 330 seconds, default 60 minutes
            IdentityTokenLifetime = 3000,

            RequireClientSecret = false,
            AllowedGrantTypes = GrantTypes.Code,
            RequirePkce = true,

            AllowAccessTokensViaBrowser = true,
            AllowOfflineAccess =true,
            AlwaysIncludeUserClaimsInIdToken = true,
            RedirectUris = new List<string>
            {
                "https://localhost:44311",
                "https://localhost:44311/silent-renew.html"

            },
            PostLogoutRedirectUris = new List<string>
            {
                "https://localhost:44311/unauthorized",
                "https://localhost:44311"
            },
            AllowedCorsOrigins = new List<string>
            {
                "https://localhost:44311"
            },
            AllowedScopes = new List<string>
            {
                "openid",
                "dataEventRecords",
                "dataeventrecordsscope",
                "role",
                "profile",
                "email"
            }
        },
        new Client
        {
            ClientName = "angularclient2",
            ClientId = "angularclient2",
            AccessTokenType = AccessTokenType.Jwt,
            AccessTokenLifetime = 3300,// 330 seconds, default 60 minutes
            IdentityTokenLifetime = 3000,

            RequireClientSecret = false,
            AllowedGrantTypes = GrantTypes.Code,
            RequirePkce = true,

            AllowAccessTokensViaBrowser = true,
            AllowOfflineAccess =true,
            AlwaysIncludeUserClaimsInIdToken = true,
            RedirectUris = new List<string>
            {
                "https://localhost:44395",
                "https://localhost:44395/silent-renew.html"
            },
            PostLogoutRedirectUris = new List<string>
            {
                "https://localhost:44395/unauthorized",
                "https://localhost:44395"
            },
            AllowedCorsOrigins = new List<string>
            {
                "https://localhost:44395"
            },
            AllowedScopes = new List<string>
            {
                "openid",
                "dataEventRecords",
                "dataeventrecordsscope",
                "role",
                "profile",
                "email"
            }
        }
    };
}