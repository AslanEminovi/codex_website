using Microsoft.EntityFrameworkCore;
using CodexCMS.Core.Models;
using CodexCMS.Data;

namespace CodexCMS.API.Services
{
    public class PageService : IPageService
    {
        private readonly ApplicationDbContext _context;

        public PageService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Page>> GetAllPagesAsync()
        {
            return await _context.Pages
                .Include(p => p.Author)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();
        }

        public async Task<IEnumerable<Page>> GetPublishedPagesAsync()
        {
            return await _context.Pages
                .Include(p => p.Author)
                .Where(p => p.Status == PageStatus.Published)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();
        }

        public async Task<Page?> GetPageByIdAsync(int id)
        {
            return await _context.Pages
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Page?> GetPageBySlugAsync(string slug)
        {
            return await _context.Pages
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Slug == slug);
        }

        public async Task<Page?> GetHomePageAsync()
        {
            return await _context.Pages
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.IsHomePage && p.Status == PageStatus.Published);
        }

        public async Task<Page> CreatePageAsync(Page page)
        {
            page.CreatedAt = DateTime.UtcNow;
            page.UpdatedAt = DateTime.UtcNow;
            
            if (page.Status == PageStatus.Published)
            {
                page.PublishedAt = DateTime.UtcNow;
            }

            _context.Pages.Add(page);
            await _context.SaveChangesAsync();
            return page;
        }

        public async Task<Page> UpdatePageAsync(Page page)
        {
            page.UpdatedAt = DateTime.UtcNow;
            
            if (page.Status == PageStatus.Published && !page.PublishedAt.HasValue)
            {
                page.PublishedAt = DateTime.UtcNow;
            }

            _context.Pages.Update(page);
            await _context.SaveChangesAsync();
            return page;
        }

        public async Task DeletePageAsync(int id)
        {
            var page = await _context.Pages.FindAsync(id);
            if (page != null)
            {
                _context.Pages.Remove(page);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> PageExistsAsync(int id)
        {
            return await _context.Pages.AnyAsync(p => p.Id == id);
        }

        public async Task<int> GetPageCountAsync()
        {
            return await _context.Pages.CountAsync();
        }

        public async Task<int> GetPublishedPageCountAsync()
        {
            return await _context.Pages.CountAsync(p => p.Status == PageStatus.Published);
        }
    }
} 