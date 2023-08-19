﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using IdentityServerAspNetIdentity.Models;
using IdentityServerAspNetIdentity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Sts.Pages.Admin;

[Authorize(AuthenticationSchemes = "Identity.Application", Policy = "IsAdmin")]
public class CreateModel : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;

    public CreateModel(UserManager<ApplicationUser> userManager)
    {
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
