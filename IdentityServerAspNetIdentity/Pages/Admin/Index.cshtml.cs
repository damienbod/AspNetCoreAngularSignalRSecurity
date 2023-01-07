using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using IdentityServerAspNetIdentity.Data;
using IdentityServerAspNetIdentity.Models;
using Microsoft.AspNetCore.Authorization;

namespace Sts.Pages.Admin;

[Authorize(AuthenticationSchemes = "Identity.Application", Policy = "IsAdmin")]
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
