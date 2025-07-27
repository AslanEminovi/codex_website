using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CodexCMS.Core.Models;
using CodexCMS.Data;
using BCrypt.Net;

namespace CodexCMS.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool success, string token, User? user)> LoginAsync(string username, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username || u.Email == username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return (false, "Invalid username or password", null);
            }

            if (!user.IsActive)
            {
                return (false, "Account is deactivated", null);
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return (true, token, user);
        }

        public async Task<(bool success, string message)> RegisterAsync(string username, string email, string password, string firstName, string lastName)
        {
            // Check if username or email already exists
            if (await _context.Users.AnyAsync(u => u.Username == username))
            {
                return (false, "Username already exists");
            }

            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return (false, "Email already exists");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = passwordHash,
                FirstName = firstName,
                LastName = lastName,
                Role = UserRole.Author,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, "Registration successful");
        }

        public async Task<(bool success, string message)> ForgotPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return (false, "Email not found");
            }

            // In a real application, you would send an email with a reset token
            // For now, we'll just return a success message
            return (true, "Password reset instructions sent to your email");
        }

        public async Task<(bool success, string message)> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return (false, "Invalid email or token");
            }

            // In a real application, you would validate the token
            // For now, we'll just update the password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            return (true, "Password reset successful");
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public string GenerateJwtToken(User user)
        {
            // Use the same JWT key logic as Program.cs
            var jwtKeyString = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? 
                               _configuration["Jwt:Key"] ?? 
                               "YourDefaultSecretKeyForDevelopmentOnlyMustBeAtLeast32CharactersLongToMeet256BitRequirement123456789";

            // Handle base64 encoded keys properly
            byte[] jwtKeyBytes;
            try 
            {
                // Try to decode as base64 first
                jwtKeyBytes = Convert.FromBase64String(jwtKeyString);
            }
            catch 
            {
                // If not base64, use as string but ensure minimum length
                if (jwtKeyString.Length < 32)
                {
                    jwtKeyString = "YourDefaultSecretKeyForDevelopmentOnlyMustBeAtLeast32CharactersLongToMeet256BitRequirement123456789";
                }
                jwtKeyBytes = System.Text.Encoding.UTF8.GetBytes(jwtKeyString);
            }

            var key = new SymmetricSecurityKey(jwtKeyBytes);
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30), // 30 minutes default
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
} 