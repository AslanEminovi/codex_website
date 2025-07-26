using CodexCMS.Core.Models;

namespace CodexCMS.API.Services
{
    public interface IMediaService
    {
        Task<IEnumerable<Media>> GetAllMediaAsync();
        Task<Media?> GetMediaByIdAsync(int id);
        Task<Media> CreateMediaAsync(Media media, IFormFile file);
        Task DeleteMediaAsync(int id);
        Task<bool> MediaExistsAsync(int id);
        Task<int> GetMediaCountAsync();
        Task<string> UploadFileAsync(IFormFile file);
        Task DeleteFileAsync(string filePath);
        Task<IEnumerable<Media>> GetMediaByUserAsync(int userId);
    }
} 