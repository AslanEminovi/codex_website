using CodexCMS.Core.Models;

namespace CodexCMS.Web.Services
{
    public interface IMenuService
    {
        Task<IEnumerable<Menu>> GetAllMenusAsync();
        Task<Menu?> GetMenuByIdAsync(int id);
        Task<Menu?> GetMenuByLocationAsync(string location);
        Task<Menu> CreateMenuAsync(Menu menu);
        Task<Menu> UpdateMenuAsync(Menu menu);
        Task DeleteMenuAsync(int id);
        Task<bool> MenuExistsAsync(int id);
        Task<IEnumerable<MenuItem>> GetMenuItemsAsync(int menuId);
        Task<MenuItem?> GetMenuItemByIdAsync(int id);
        Task<MenuItem> CreateMenuItemAsync(MenuItem menuItem);
        Task<MenuItem> UpdateMenuItemAsync(MenuItem menuItem);
        Task DeleteMenuItemAsync(int id);
        Task<IEnumerable<MenuItem>> GetMenuItemsByLocationAsync(string location);
    }
} 