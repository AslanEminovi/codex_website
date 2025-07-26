using CodexCMS.Core.Models;

namespace CodexCMS.API.Services
{
    public interface ITagService
    {
        Task<IEnumerable<Tag>> GetAllTagsAsync();
        Task<IEnumerable<Tag>> GetActiveTagsAsync();
        Task<Tag?> GetTagByIdAsync(int id);
        Task<Tag?> GetTagBySlugAsync(string slug);
        Task<Tag> CreateTagAsync(Tag tag);
        Task<Tag> UpdateTagAsync(Tag tag);
        Task DeleteTagAsync(int id);
        Task<bool> TagExistsAsync(int id);
        Task<int> GetTagCountAsync();
        Task<IEnumerable<Tag>> GetTagsForPostAsync(int postId);
        Task AssignTagsToPostAsync(int postId, IEnumerable<int> tagIds);
    }
} 