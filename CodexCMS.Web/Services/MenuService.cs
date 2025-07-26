using Microsoft.EntityFrameworkCore;
using CodexCMS.Core.Models;
using CodexCMS.Data;

namespace CodexCMS.Web.Services
{
    public class MenuService : IMenuService
    {
        private readonly ApplicationDbContext _context;

        public MenuService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Menu>> GetAllMenusAsync()
        {
            return await _context.Menus
                .Include(m => m.MenuItems)
                .OrderBy(m => m.Name)
                .ToListAsync();
        }

        public async Task<Menu?> GetMenuByIdAsync(int id)
        {
            return await _context.Menus
                .Include(m => m.MenuItems)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Menu?> GetMenuByLocationAsync(string location)
        {
            return await _context.Menus
                .Include(m => m.MenuItems)
                .Where(m => m.Location == location && m.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<Menu> CreateMenuAsync(Menu menu)
        {
            menu.CreatedAt = DateTime.UtcNow;
            menu.UpdatedAt = DateTime.UtcNow;
            
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();
            return menu;
        }

        public async Task<Menu> UpdateMenuAsync(Menu menu)
        {
            menu.UpdatedAt = DateTime.UtcNow;
            
            _context.Menus.Update(menu);
            await _context.SaveChangesAsync();
            return menu;
        }

        public async Task DeleteMenuAsync(int id)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu != null)
            {
                _context.Menus.Remove(menu);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> MenuExistsAsync(int id)
        {
            return await _context.Menus.AnyAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<MenuItem>> GetMenuItemsAsync(int menuId)
        {
            return await _context.MenuItems
                .Include(mi => mi.SubMenuItems)
                .Where(mi => mi.MenuId == menuId && mi.ParentMenuItemId == null)
                .OrderBy(mi => mi.DisplayOrder)
                .ToListAsync();
        }

        public async Task<MenuItem?> GetMenuItemByIdAsync(int id)
        {
            return await _context.MenuItems
                .Include(mi => mi.Menu)
                .Include(mi => mi.ParentMenuItem)
                .Include(mi => mi.SubMenuItems)
                .FirstOrDefaultAsync(mi => mi.Id == id);
        }

        public async Task<MenuItem> CreateMenuItemAsync(MenuItem menuItem)
        {
            menuItem.CreatedAt = DateTime.UtcNow;
            
            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();
            return menuItem;
        }

        public async Task<MenuItem> UpdateMenuItemAsync(MenuItem menuItem)
        {
            _context.MenuItems.Update(menuItem);
            await _context.SaveChangesAsync();
            return menuItem;
        }

        public async Task DeleteMenuItemAsync(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem != null)
            {
                _context.MenuItems.Remove(menuItem);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<MenuItem>> GetMenuItemsByLocationAsync(string location)
        {
            return await _context.MenuItems
                .Include(mi => mi.SubMenuItems)
                .Where(mi => mi.Menu.Location == location && mi.Menu.IsActive && mi.IsActive && mi.ParentMenuItemId == null)
                .OrderBy(mi => mi.DisplayOrder)
                .ToListAsync();
        }
    }
} 