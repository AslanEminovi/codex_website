using CodexCMS.Core.Models;

namespace CodexCMS.Web.Services
{
    public interface IAuthService
    {
        Task<(bool success, string token, User? user)> LoginAsync(string username, string password);
        Task<(bool success, string message)> RegisterAsync(string username, string email, string password, string firstName, string lastName);
        Task<(bool success, string message)> ForgotPasswordAsync(string email);
        Task<(bool success, string message)> ResetPasswordAsync(string email, string token, string newPassword);
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        string GenerateJwtToken(User user);
    }
} 