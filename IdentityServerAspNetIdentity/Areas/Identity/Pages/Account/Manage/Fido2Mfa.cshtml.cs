using Microsoft.AspNetCore.Mvc.RazorPages;

namespace IdentityServerAspNetIdentity.Areas.Identity.Pages.Account.Manage;

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
