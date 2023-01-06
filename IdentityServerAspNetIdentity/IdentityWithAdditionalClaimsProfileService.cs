using Duende.IdentityServer;
using Duende.IdentityServer.AspNetIdentity;
using Duende.IdentityServer.Extensions;
using Duende.IdentityServer.Models;
using IdentityModel;
using IdentityServerHost.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace IdentityServerAspNetIdentity;

public class IdentityWithAdditionalClaimsProfileService : ProfileService<ApplicationUser>
{
    public IdentityWithAdditionalClaimsProfileService(UserManager<ApplicationUser> userManager, 
        IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory) : base(userManager, claimsFactory)
    {
    }

    protected override async Task GetProfileDataAsync(ProfileDataRequestContext context, ApplicationUser user)
    {
        var principal = await GetUserClaimsAsync(user);
        var id = (ClaimsIdentity)principal.Identity;
        var sub = context.Subject.GetSubjectId();

        var claims = principal.Claims.ToList();
        claims = claims.Where(claim => context.RequestedClaimTypes.Contains(claim.Type)).ToList();
        claims.Add(new Claim(JwtClaimTypes.Role, "dataEventRecords.user"));
        claims.Add(new Claim(JwtClaimTypes.Role, "dataEventRecords"));
        claims.Add(new Claim(JwtClaimTypes.Scope, "dataEventRecords"));
        claims.Add(new Claim(JwtClaimTypes.Role, "securedFiles.user"));
        claims.Add(new Claim(JwtClaimTypes.Role, "securedFiles"));
        claims.Add(new Claim(JwtClaimTypes.Scope, "securedFiles"));
        claims.Add(new Claim(JwtClaimTypes.GivenName, user.UserName));

        if (user.IsAdmin)
        {
            claims.Add(new Claim(JwtClaimTypes.Role, "admin"));
        }
        else
        {
            claims.Add(new Claim(JwtClaimTypes.Role, "user"));
        }

        if (user.DataEventRecordsRole == "dataEventRecords.admin")
        {
            claims.Add(new Claim(JwtClaimTypes.Role, "dataEventRecords.admin"));
        }

        if (user.SecuredFilesRole == "securedFiles.admin")
        {
            claims.Add(new Claim(JwtClaimTypes.Role, "securedFiles.admin"));
        }

        //claims.Add(new Claim(IdentityServerConstants.StandardScopes.Email, user.Email));
        //claims.Add(new Claim("name", user.Email));

        context.AddRequestedClaims(claims);
    }
}
