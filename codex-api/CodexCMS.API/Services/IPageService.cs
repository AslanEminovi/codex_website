using CodexCMS.Core.Models;

namespace CodexCMS.API.Services
{
    public interface IPageService
    {
        Task<IEnumerable<Page>> GetAllPagesAsync();
        Task<IEnumerable<Page>> GetPublishedPagesAsync();
        Task<Page?> GetPageByIdAsync(int id);
        Task<Page?> GetPageBySlugAsync(string slug);
        Task<Page?> GetHomePageAsync();
        Task<Page> CreatePageAsync(Page page);
        Task<Page> UpdatePageAsync(Page page);
        Task DeletePageAsync(int id);
        Task<bool> PageExistsAsync(int id);
        Task<int> GetPageCountAsync();
        Task<int> GetPublishedPageCountAsync();
    }
} 