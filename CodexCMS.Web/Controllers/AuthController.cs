using Microsoft.AspNetCore.Mvc;
using CodexCMS.Web.Services;
using CodexCMS.Web.Models;

namespace CodexCMS.Web.Controllers
{
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectToAction("Dashboard", "Admin");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var (success, token, user) = await _authService.LoginAsync(model.Username, model.Password);

            if (success)
            {
                // In a real application, you would set up proper authentication
                // For now, we'll use session
                HttpContext.Session.SetString("UserToken", token);
                HttpContext.Session.SetString("Username", user?.Username ?? "");
                
                TempData["Success"] = "Login successful!";
                return RedirectToAction("Dashboard", "Admin");
            }

            ModelState.AddModelError("", "Invalid username or password");
            return View(model);
        }

        [HttpGet]
        public IActionResult Register()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectToAction("Dashboard", "Admin");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var (success, message) = await _authService.RegisterAsync(
                model.Username, 
                model.Email, 
                model.Password, 
                model.FirstName, 
                model.LastName
            );

            if (success)
            {
                TempData["Success"] = message;
                return RedirectToAction("Login");
            }

            ModelState.AddModelError("", message);
            return View(model);
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var (success, message) = await _authService.ForgotPasswordAsync(model.Email);

            if (success)
            {
                TempData["Success"] = message;
                return RedirectToAction("Login");
            }

            ModelState.AddModelError("", message);
            return View(model);
        }

        [HttpGet]
        public IActionResult ResetPassword(string email, string token)
        {
            var model = new ResetPasswordViewModel
            {
                Email = email,
                Token = token
            };
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var (success, message) = await _authService.ResetPasswordAsync(model.Email, model.Token, model.NewPassword);

            if (success)
            {
                TempData["Success"] = message;
                return RedirectToAction("Login");
            }

            ModelState.AddModelError("", message);
            return View(model);
        }

        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            TempData["Success"] = "You have been logged out successfully.";
            return RedirectToAction("Index", "Home");
        }
    }
} 