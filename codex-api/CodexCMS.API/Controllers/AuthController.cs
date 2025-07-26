using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CodexCMS.API.Services;
using CodexCMS.Core.Models;

namespace CodexCMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request.UsernameOrEmail, request.Password);
                
                if (result.success)
                {
                    return Ok(new
                    {
                        success = true,
                        token = result.token,
                        user = new
                        {
                            id = result.user?.Id,
                            username = result.user?.Username,
                            email = result.user?.Email,
                            role = result.user?.Role.ToString(),
                            firstName = result.user?.FirstName,
                            lastName = result.user?.LastName
                        }
                    });
                }

                return BadRequest(new { success = false, message = "Invalid username/email or password." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred during login." });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.RegisterAsync(
                    request.Username, 
                    request.Email, 
                    request.Password, 
                    request.FirstName, 
                    request.LastName
                );

                if (result.success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Registration successful"
                    });
                }

                return BadRequest(new { success = false, message = result.message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred during registration." });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var username = User.Identity?.Name;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized();
                }

                var user = await _authService.GetUserByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound();
                }

                return Ok(new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    role = user.Role.ToString(),
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    isActive = user.IsActive,
                    createdAt = user.CreatedAt,
                    lastLoginAt = user.LastLoginAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred." });
            }
        }
    }

    // DTOs
    public class LoginRequest
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
} 