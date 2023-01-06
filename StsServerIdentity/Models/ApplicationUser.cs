using Microsoft.AspNetCore.Identity;
namespace StsServerIdentity.Models
{
    public class ApplicationUser : IdentityUser
    {
        public bool IsAdmin { get; set; }
        public string DataEventRecordsRole { get; set; }
        public string SecuredFilesRole { get; set; }
    }
}