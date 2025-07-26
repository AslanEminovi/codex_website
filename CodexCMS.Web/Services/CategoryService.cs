using Microsoft.EntityFrameworkCore;
using CodexCMS.Core.Models;
using CodexCMS.Data;

namespace CodexCMS.Web.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetRootCategoriesAsync()
        {
            return await _context.Categories
                .Include(c => c.SubCategories)
                .Where(c => c.ParentCategoryId == null && c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentId)
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Where(c => c.ParentCategoryId == parentId && c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Category?> GetCategoryBySlugAsync(string slug)
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.Slug == slug);
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            category.CreatedAt = DateTime.UtcNow;
            category.UpdatedAt = DateTime.UtcNow;
            
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            category.UpdatedAt = DateTime.UtcNow;
            
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> CategoryExistsAsync(int id)
        {
            return await _context.Categories.AnyAsync(c => c.Id == id);
        }

        public async Task<int> GetCategoryCountAsync()
        {
            return await _context.Categories.CountAsync();
        }

        public async Task<IEnumerable<Category>> GetCategoriesWithPostCountAsync()
        {
            return await _context.Categories
                .Include(c => c.Posts)
                .Where(c => c.IsActive)
                .Select(c => new Category
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    ParentCategoryId = c.ParentCategoryId,
                    IsActive = c.IsActive,
                    DisplayOrder = c.DisplayOrder,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    Posts = c.Posts.Where(p => p.Status == PostStatus.Published).ToList()
                })
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();
        }
    }
} 