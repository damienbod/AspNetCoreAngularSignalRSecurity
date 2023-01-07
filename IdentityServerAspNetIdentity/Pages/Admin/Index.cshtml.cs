using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using IdentityServerAspNetIdentity.Data;
using IdentityServerAspNetIdentity.Models;
using IdentityServerHost.Models;
using Microsoft.AspNetCore.Identity;

namespace Sts.Pages.Admin
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<AdminViewModel> AdminViewModel { get;set; }

        public async Task OnGetAsync()
        {
            AdminViewModel = await _context.Users.Select(user =>
            new AdminViewModel
            {
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                DataEventRecordsRole = user.DataEventRecordsRole,
                SecuredFilesRole = user.SecuredFilesRole
            }).ToListAsync();
        }
    }
}
