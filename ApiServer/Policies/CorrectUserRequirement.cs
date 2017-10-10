using Microsoft.AspNetCore.Authorization;

namespace ApiServer.Policies
{
    public class CorrectUserRequirement : IAuthorizationRequirement
    {
        public string Username { get; set; }

        public CorrectUserRequirement()
        {
            //Username = username;
        }
    }
}
