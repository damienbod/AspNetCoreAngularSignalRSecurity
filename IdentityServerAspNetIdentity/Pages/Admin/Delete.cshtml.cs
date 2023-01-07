using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using IdentityServerAspNetIdentity.Data;
using IdentityServerAspNetIdentity.Models;
using IdentityServerHost.Models;
using Microsoft.AspNetCore.Identity;

namespace Sts.Pages.Admin
{
    public class DeleteModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public DeleteModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [BindProperty]
        public AdminViewModel AdminViewModel { get; set; }

        public async Task<IActionResult> OnGetAsync(string? id)
        {
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

        public async Task<IActionResult> OnPostAsync(string? id)
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

            await _userManager.DeleteAsync(user);

            return RedirectToPage("./Index");
        }
    }
}
