using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using IdentityServerAspNetIdentity.Data;
using IdentityServerAspNetIdentity.Models;
using Microsoft.AspNetCore.Authorization;

namespace Sts.Pages.Admin;

[Authorize(AuthenticationSchemes = "Identity.Application", Policy = "IsAdmin")]
public class DetailsModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public DetailsModel(ApplicationDbContext context)
    {
        _context = context;
    }

    public AdminViewModel AdminViewModel { get; set; }

    public async Task<IActionResult> OnGetAsync(string? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var user = await _context.Users.FirstOrDefaultAsync(m => m.Email == id);
        if (user == null)
        {
            return NotFound();
        }

        AdminViewModel = new AdminViewModel
        {
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            DataEventRecordsRole = user.DataEventRecordsRole,
            SecuredFilesRole = user.SecuredFilesRole
        };

        return Page();
    }
}
