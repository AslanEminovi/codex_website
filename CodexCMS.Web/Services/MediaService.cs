using Microsoft.EntityFrameworkCore;
using CodexCMS.Core.Models;
using CodexCMS.Data;

namespace CodexCMS.Web.Services
{
    public class MediaService : IMediaService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public MediaService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<IEnumerable<Media>> GetAllMediaAsync()
        {
            return await _context.Media
                .Include(m => m.UploadedBy)
                .OrderByDescending(m => m.UploadedAt)
                .ToListAsync();
        }

        public async Task<Media?> GetMediaByIdAsync(int id)
        {
            return await _context.Media
                .Include(m => m.UploadedBy)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Media> CreateMediaAsync(Media media, IFormFile file)
        {
            var fileName = await UploadFileAsync(file);
            
            media.FileName = file.FileName;
            media.FilePath = fileName;
            media.ContentType = file.ContentType;
            media.FileSize = file.Length;
            media.UploadedAt = DateTime.UtcNow;

            _context.Media.Add(media);
            await _context.SaveChangesAsync();
            return media;
        }

        public async Task DeleteMediaAsync(int id)
        {
            var media = await _context.Media.FindAsync(id);
            if (media != null)
            {
                await DeleteFileAsync(media.FilePath);
                _context.Media.Remove(media);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> MediaExistsAsync(int id)
        {
            return await _context.Media.AnyAsync(m => m.Id == id);
        }

        public async Task<int> GetMediaCountAsync()
        {
            return await _context.Media.CountAsync();
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return fileName;
        }

        public async Task DeleteFileAsync(string filePath)
        {
            var fullPath = Path.Combine(_environment.WebRootPath, "uploads", filePath);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }

        public async Task<IEnumerable<Media>> GetMediaByUserAsync(int userId)
        {
            return await _context.Media
                .Where(m => m.UploadedById == userId)
                .OrderByDescending(m => m.UploadedAt)
                .ToListAsync();
        }
    }
} 