using CodexCMS.Core.Models;

namespace CodexCMS.Web.Services
{
    public interface IPostService
    {
        Task<IEnumerable<Post>> GetAllPostsAsync();
        Task<IEnumerable<Post>> GetPublishedPostsAsync();
        Task<IEnumerable<Post>> GetPostsByCategoryAsync(int categoryId);
        Task<IEnumerable<Post>> GetPostsByTagAsync(int tagId);
        Task<Post?> GetPostByIdAsync(int id);
        Task<Post?> GetPostBySlugAsync(string slug);
        Task<Post> CreatePostAsync(Post post);
        Task<Post> UpdatePostAsync(Post post);
        Task DeletePostAsync(int id);
        Task<bool> PostExistsAsync(int id);
        Task<IEnumerable<Post>> GetFeaturedPostsAsync(int count = 6);
        Task<IEnumerable<Post>> GetRecentPostsAsync(int count = 5);
        Task<int> GetPostCountAsync();
        Task<int> GetPublishedPostCountAsync();
    }
} 