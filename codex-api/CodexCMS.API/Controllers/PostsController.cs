using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CodexCMS.Core.Models;
using CodexCMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CodexCMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var posts = await _context.Posts
                    .Include(p => p.Author)
                    .Include(p => p.Category)
                    .Where(p => p.Status == PostStatus.Published)
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Content,
                        p.Excerpt,
                        p.Slug,
                        p.Status,
                        p.CreatedAt,
                        p.UpdatedAt,
                        Author = new { p.Author.Username, p.Author.FirstName, p.Author.LastName },
                        Category = p.Category != null ? new { p.Category.Name, p.Category.Slug } : null
                    })
                    .ToListAsync();

                var totalPosts = await _context.Posts.CountAsync(p => p.Status == PostStatus.Published);

                return Ok(new
                {
                    posts,
                    totalPosts,
                    currentPage = page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalPosts / pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting posts: {ex.Message}" });
            }
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetPostBySlug(string slug)
        {
            try
            {
                var post = await _context.Posts
                    .Include(p => p.Author)
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == PostStatus.Published);

                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                return Ok(new
                {
                    post.Id,
                    post.Title,
                    post.Content,
                    post.Excerpt,
                    post.Slug,
                    post.Status,
                    post.CreatedAt,
                    post.UpdatedAt,
                    Author = new { post.Author.Username, post.Author.FirstName, post.Author.LastName },
                    Category = post.Category != null ? new { post.Category.Name, post.Category.Slug } : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting post: {ex.Message}" });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        {
            try
            {
                // Get current user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                // Get default category if none provided
                int? categoryId = request.CategoryId;
                if (categoryId == null)
                {
                    var defaultCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == "general");
                    categoryId = defaultCategory?.Id;
                }

                var post = new Post
                {
                    Title = request.Title,
                    Content = request.Content,
                    Excerpt = request.Excerpt ?? (request.Content.Length > 200 ? request.Content.Substring(0, 200) + "..." : request.Content),
                    Slug = GenerateSlug(request.Title),
                    AuthorId = userId,
                    CategoryId = categoryId,
                    Status = PostStatus.Published,
                    PublishedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post created successfully", postId = post.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔴 Post creation error: {ex.Message}");
                Console.WriteLine($"🔴 Inner exception: {ex.InnerException?.Message}");
                Console.WriteLine($"🔴 Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Error creating post: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] CreatePostRequest request)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);
                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                // Get current user ID and role from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
                
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                // Only allow post author or admin to edit
                if (post.AuthorId != userId && roleClaim?.Value != "Admin")
                {
                    return Forbid("You can only edit your own posts");
                }

                post.Title = request.Title;
                post.Content = request.Content;
                post.Excerpt = request.Excerpt ?? request.Content.Substring(0, Math.Min(request.Content.Length, 200));
                post.Slug = GenerateSlug(request.Title);
                post.CategoryId = request.CategoryId;
                post.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Post updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating post: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);
                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                // Get current user ID and role from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
                
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                // Only allow post author or admin to delete
                if (post.AuthorId != userId && roleClaim?.Value != "Admin")
                {
                    return Forbid("You can only delete your own posts");
                }

                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error deleting post: {ex.Message}" });
            }
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllPostsForAdmin([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var posts = await _context.Posts
                    .Include(p => p.Author)
                    .Include(p => p.Category)
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Content,
                        p.Excerpt,
                        p.Slug,
                        p.Status,
                        p.CreatedAt,
                        p.UpdatedAt,
                        Author = new { p.Author.Username, p.Author.FirstName, p.Author.LastName },
                        Category = p.Category != null ? new { p.Category.Name, p.Category.Slug } : null
                    })
                    .ToListAsync();

                var totalPosts = await _context.Posts.CountAsync();

                return Ok(new
                {
                    posts,
                    totalPosts,
                    currentPage = page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalPosts / pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting posts: {ex.Message}" });
            }
        }

        private string GenerateSlug(string title)
        {
            return title.ToLower()
                       .Replace(" ", "-")
                       .Replace("'", "")
                       .Replace("\"", "")
                       .Replace("!", "")
                       .Replace("?", "")
                       .Replace(",", "")
                       .Replace(".", "");
        }
    }

    public class CreatePostRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public int? CategoryId { get; set; }
    }
} 