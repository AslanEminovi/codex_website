using Microsoft.EntityFrameworkCore;
using CodexCMS.Core.Models;
using CodexCMS.Data;

namespace CodexCMS.Web.Services
{
    public class TagService : ITagService
    {
        private readonly ApplicationDbContext _context;

        public TagService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tag>> GetAllTagsAsync()
        {
            return await _context.Tags
                .OrderBy(t => t.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Tag>> GetActiveTagsAsync()
        {
            return await _context.Tags
                .Where(t => t.IsActive)
                .OrderBy(t => t.Name)
                .ToListAsync();
        }

        public async Task<Tag?> GetTagByIdAsync(int id)
        {
            return await _context.Tags.FindAsync(id);
        }

        public async Task<Tag?> GetTagBySlugAsync(string slug)
        {
            return await _context.Tags.FirstOrDefaultAsync(t => t.Slug == slug);
        }

        public async Task<Tag> CreateTagAsync(Tag tag)
        {
            tag.CreatedAt = DateTime.UtcNow;
            
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
            return tag;
        }

        public async Task<Tag> UpdateTagAsync(Tag tag)
        {
            _context.Tags.Update(tag);
            await _context.SaveChangesAsync();
            return tag;
        }

        public async Task DeleteTagAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag != null)
            {
                _context.Tags.Remove(tag);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> TagExistsAsync(int id)
        {
            return await _context.Tags.AnyAsync(t => t.Id == id);
        }

        public async Task<int> GetTagCountAsync()
        {
            return await _context.Tags.CountAsync();
        }

        public async Task<IEnumerable<Tag>> GetTagsForPostAsync(int postId)
        {
            return await _context.PostTags
                .Where(pt => pt.PostId == postId)
                .Include(pt => pt.Tag)
                .Select(pt => pt.Tag)
                .ToListAsync();
        }

        public async Task AssignTagsToPostAsync(int postId, IEnumerable<int> tagIds)
        {
            // Remove existing tags
            var existingTags = await _context.PostTags
                .Where(pt => pt.PostId == postId)
                .ToListAsync();
            
            _context.PostTags.RemoveRange(existingTags);

            // Add new tags
            var postTags = tagIds.Select(tagId => new PostTag
            {
                PostId = postId,
                TagId = tagId
            });

            _context.PostTags.AddRange(postTags);
            await _context.SaveChangesAsync();
        }
    }
} 