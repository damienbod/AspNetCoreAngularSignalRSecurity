using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using IdentityServerAspNetIdentity.Data;
using IdentityServerAspNetIdentity.Models;
using IdentityServerHost.Models;
using Microsoft.AspNetCore.Identity;

namespace Sts.Pages.Admin
{
    public class CreateModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CreateModel(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public AdminViewModel AdminViewModel { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            await _userManager.CreateAsync(new ApplicationUser
            {
                Email = AdminViewModel.Email,
                IsAdmin = AdminViewModel.IsAdmin,
                DataEventRecordsRole = AdminViewModel.DataEventRecordsRole,
                SecuredFilesRole = AdminViewModel.SecuredFilesRole,
                UserName = AdminViewModel.Email
            });

            return RedirectToPage("./Index");
        }
    }
}
