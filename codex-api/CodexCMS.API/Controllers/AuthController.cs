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
                Console.WriteLine($"🔵 Login attempt: {request.UsernameOrEmail}");
                
                var result = await _authService.LoginAsync(request.UsernameOrEmail, request.Password);
                
                Console.WriteLine($"🔵 Login result: success={result.success}, token length={result.token?.Length ?? 0}");
                
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

                Console.WriteLine($"🔴 Login failed: {result.token}");
                return BadRequest(new { success = false, message = "Invalid username/email or password." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔴 Login exception: {ex.Message}");
                Console.WriteLine($"🔴 Login stack trace: {ex.StackTrace}");
                return StatusCode(500, new { success = false, message = "An error occurred during login." });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                Console.WriteLine($"🔵 Registration attempt: {request.Username}, {request.Email}");
                
                var result = await _authService.RegisterAsync(
                    request.Username, 
                    request.Email, 
                    request.Password, 
                    request.FirstName, 
                    request.LastName
                );

                Console.WriteLine($"🔵 Registration result: success={result.success}, message={result.message}");

                if (result.success)
                {
                    try 
                    {
                        Console.WriteLine($"🔵 Attempting auto-login for {request.Username}");
                        
                        // After successful registration, log the user in to get token
                        var loginResult = await _authService.LoginAsync(request.Username, request.Password);
                        
                        Console.WriteLine($"🔵 Auto-login result: success={loginResult.success}");
                        
                        if (loginResult.success)
                        {
                            return Ok(new
                            {
                                success = true,
                                token = loginResult.token,
                                user = new
                                {
                                    id = loginResult.user?.Id,
                                    username = loginResult.user?.Username,
                                    email = loginResult.user?.Email,
                                    role = loginResult.user?.Role.ToString(),
                                    firstName = loginResult.user?.FirstName,
                                    lastName = loginResult.user?.LastName
                                },
                                message = "Registration successful"
                            });
                        }
                        else
                        {
                            Console.WriteLine($"🔴 Auto-login failed: {loginResult.token}");
                            // Registration succeeded but login failed - still return success
                            return Ok(new
                            {
                                success = true,
                                message = "Registration successful. Please login manually."
                            });
                        }
                    }
                    catch (Exception loginEx)
                    {
                        Console.WriteLine($"🔴 Auto-login exception: {loginEx.Message}");
                        // Registration succeeded but login failed - still return success
                        return Ok(new
                        {
                            success = true,
                            message = "Registration successful. Please login manually."
                        });
                    }
                }

                Console.WriteLine($"🔴 Registration failed: {result.message}");
                return BadRequest(new { success = false, message = result.message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔴 Registration exception: {ex.Message}");
                Console.WriteLine($"🔴 Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { success = false, message = "An error occurred during registration." });
            }
        }

        [HttpPost("test-register")]
        public async Task<IActionResult> TestRegister()
        {
            try
            {
                var testData = new RegisterRequest
                {
                    Username = "testuser" + DateTime.Now.Ticks,
                    Email = "test" + DateTime.Now.Ticks + "@example.com",
                    Password = "Test123!",
                    FirstName = "Test",
                    LastName = "User"
                };

                Console.WriteLine($"🔵 TEST Registration attempt: {testData.Username}, {testData.Email}");
                
                var result = await _authService.RegisterAsync(
                    testData.Username, 
                    testData.Email, 
                    testData.Password, 
                    testData.FirstName, 
                    testData.LastName
                );

                Console.WriteLine($"🔵 TEST Registration result: success={result.success}, message={result.message}");
                
                return Ok(new { 
                    success = result.success, 
                    message = result.message,
                    testData = testData,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔴 TEST Registration exception: {ex.Message}");
                Console.WriteLine($"🔴 TEST Stack trace: {ex.StackTrace}");
                return Ok(new { 
                    success = false, 
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
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