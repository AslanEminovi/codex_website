using Microsoft.EntityFrameworkCore;
using CodexCMS.Core.Models;
using CodexCMS.Data;

namespace CodexCMS.Web.Services
{
    public class PostService : IPostService
    {
        private readonly ApplicationDbContext _context;

        public PostService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Post>> GetAllPostsAsync()
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPublishedPostsAsync()
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .Where(p => p.Status == PostStatus.Published)
                .OrderByDescending(p => p.PublishedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsByCategoryAsync(int categoryId)
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .Where(p => p.CategoryId == categoryId && p.Status == PostStatus.Published)
                .OrderByDescending(p => p.PublishedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsByTagAsync(int tagId)
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .Where(p => p.PostTags.Any(pt => pt.TagId == tagId) && p.Status == PostStatus.Published)
                .OrderByDescending(p => p.PublishedAt)
                .ToListAsync();
        }

        public async Task<Post?> GetPostByIdAsync(int id)
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Post?> GetPostBySlugAsync(string slug)
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(p => p.Slug == slug);
        }

        public async Task<Post> CreatePostAsync(Post post)
        {
            post.CreatedAt = DateTime.UtcNow;
            post.UpdatedAt = DateTime.UtcNow;
            
            if (post.Status == PostStatus.Published)
            {
                post.PublishedAt = DateTime.UtcNow;
            }

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<Post> UpdatePostAsync(Post post)
        {
            post.UpdatedAt = DateTime.UtcNow;
            
            if (post.Status == PostStatus.Published && !post.PublishedAt.HasValue)
            {
                post.PublishedAt = DateTime.UtcNow;
            }

            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task DeletePostAsync(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> PostExistsAsync(int id)
        {
            return await _context.Posts.AnyAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Post>> GetFeaturedPostsAsync(int count = 6)
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .Where(p => p.Status == PostStatus.Published && p.IsFeatured)
                .OrderByDescending(p => p.PublishedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetRecentPostsAsync(int count = 5)
        {
            return await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .Where(p => p.Status == PostStatus.Published)
                .OrderByDescending(p => p.PublishedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<int> GetPostCountAsync()
        {
            return await _context.Posts.CountAsync();
        }

        public async Task<int> GetPublishedPostCountAsync()
        {
            return await _context.Posts.CountAsync(p => p.Status == PostStatus.Published);
        }
    }
} 