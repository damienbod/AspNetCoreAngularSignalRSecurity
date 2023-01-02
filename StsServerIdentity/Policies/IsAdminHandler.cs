using Microsoft.AspNetCore.Authorization;

namespace StsServerIdentity;

public class IsAdminHandler : AuthorizationHandler<IsAdminRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsAdminRequirement requirement)
    {
        if (context == null)
            throw new ArgumentNullException(nameof(context));
        if (requirement == null)
            throw new ArgumentNullException(nameof(requirement));

        var adminClaim = context.User.Claims.FirstOrDefault(t => t.Value == "admin" && t.Type == "role");
        if (adminClaim != null)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}