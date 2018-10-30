using System.ComponentModel.DataAnnotations;

namespace StsServer.Models
{
    public class AdminViewModel
    {
        [Key]
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
        public string DataEventRecordsRole { get; set; }
        public string SecuredFilesRole { get; set; }
    }
}
