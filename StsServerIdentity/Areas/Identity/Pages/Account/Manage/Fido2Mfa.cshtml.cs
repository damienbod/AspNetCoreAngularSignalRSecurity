﻿using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AspNetCoreIdentityFido2Mfa.Areas.Identity.Pages.Account.Manage;

public class MfaModel : PageModel
{
    public void OnGet()
    {
        var test = User.FindFirst("email").Value;
    }

    public void OnPost()
    {
    }
}
