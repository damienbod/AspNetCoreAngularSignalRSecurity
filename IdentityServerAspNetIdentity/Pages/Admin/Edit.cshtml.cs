using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using IdentityServerAspNetIdentity.Models;
using IdentityServerHost.Models;
using Microsoft.AspNetCore.Identity;

namespace Sts.Pages.Admin;

public class EditModel : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;

    public EditModel(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [BindProperty]
    public AdminViewModel AdminViewModel { get; set; }

    public async Task<IActionResult> OnGetAsync(string? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var user = await _userManager.FindByEmailAsync(id);
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

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        var user = await _userManager.FindByEmailAsync(AdminViewModel.Email);
        if (user == null)
        {
            return NotFound();
        }

        user.IsAdmin = AdminViewModel.IsAdmin;
        user.DataEventRecordsRole = AdminViewModel.DataEventRecordsRole;
        user.SecuredFilesRole = AdminViewModel.SecuredFilesRole;

        await _userManager.UpdateAsync(user);

        return RedirectToPage("./Index");
    }
}
