using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StsServerIdentity.Data;
using StsServerIdentity.Models;

namespace StsServerIdentity.Controllers
{
    [Authorize(AuthenticationSchemes = "Identity.Application", Policy = "IsAdmin")]
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Admin
        public async Task<IActionResult> Index()
        {
            return View(await _context.Users.Select(user => 
                new AdminViewModel {
                    Email = user.Email,
                    IsAdmin = user.IsAdmin,
                    DataEventRecordsRole = user.DataEventRecordsRole,
                    SecuredFilesRole = user.SecuredFilesRole
                }).ToListAsync());
        }

        // GET: Admin/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(m => m.Email == id);
            if (user == null)
            {
                return NotFound();
            }

            return View(new AdminViewModel
            {
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                DataEventRecordsRole = user.DataEventRecordsRole,
                SecuredFilesRole = user.SecuredFilesRole
            });
        }

        // GET: Admin/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Admin/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Email,IsAdmin,DataEventRecordsRole,SecuredFilesRole")] AdminViewModel adminViewModel)
        {
            if (ModelState.IsValid)
            {
                await _userManager.CreateAsync(new ApplicationUser
                {
                    Email = adminViewModel.Email,
                    IsAdmin = adminViewModel.IsAdmin,
                    DataEventRecordsRole = adminViewModel.DataEventRecordsRole,
                    SecuredFilesRole = adminViewModel.SecuredFilesRole,
                    UserName = adminViewModel.Email
                });
                return RedirectToAction(nameof(Index));
            }
            return View(adminViewModel);
        }

        // GET: Admin/Edit/5
        public async Task<IActionResult> Edit(string id)
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

            return View(new AdminViewModel
            {
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                DataEventRecordsRole = user.DataEventRecordsRole,
                SecuredFilesRole = user.SecuredFilesRole
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("Email,IsAdmin,DataEventRecordsRole,SecuredFilesRole")] AdminViewModel adminViewModel)
        {
            if (id != adminViewModel.Email)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var user = await _userManager.FindByEmailAsync(id);
                    user.IsAdmin = adminViewModel.IsAdmin;
                    user.DataEventRecordsRole = adminViewModel.DataEventRecordsRole;
                    user.SecuredFilesRole = adminViewModel.SecuredFilesRole;

                    await _userManager.UpdateAsync(user);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AdminViewModelExists(adminViewModel.Email))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(adminViewModel);
        }

        // GET: Admin/Delete/5
        public async Task<IActionResult> Delete(string id)
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

            return View(new AdminViewModel
            {
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                DataEventRecordsRole = user.DataEventRecordsRole,
                SecuredFilesRole = user.SecuredFilesRole
            });
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var user = await _userManager.FindByEmailAsync(id);
            await _userManager.DeleteAsync(user);
            return RedirectToAction(nameof(Index));
        }

        private bool AdminViewModelExists(string id)
        {
            return _context.Users.Any(e => e.Email == id);
        }
    }
}
