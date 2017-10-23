using Microsoft.AspNetCore.Authorization;

namespace ApiServer.Policies
{
    public class CorrectUserRequirement : IAuthorizationRequirement
    {
        public CorrectUserRequirement()
        {
        }
    }
}
