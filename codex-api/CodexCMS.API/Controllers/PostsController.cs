using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CodexCMS.API.Services;
using CodexCMS.Core.Models;

namespace CodexCMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] PostStatus? status = null)
        {
            try
            {
                var posts = await _postService.GetPostsAsync(page, pageSize, search, categoryId, status);
                var totalPosts = await _postService.GetPostCountAsync(search, categoryId, status);

                return Ok(new
                {
                    data = posts.Select(p => new
                    {
                        id = p.Id,
                        title = p.Title,
                        slug = p.Slug,
                        excerpt = p.Excerpt,
                        featuredImageUrl = p.FeaturedImageUrl,
                        status = p.Status.ToString(),
                        publishedAt = p.PublishedAt,
                        viewCount = p.ViewCount,
                        isFeatured = p.IsFeatured,
                        createdAt = p.CreatedAt,
                        updatedAt = p.UpdatedAt,
                        author = new
                        {
                            id = p.Author?.Id,
                            username = p.Author?.Username,
                            firstName = p.Author?.FirstName,
                            lastName = p.Author?.LastName
                        },
                        category = p.Category != null ? new
                        {
                            id = p.Category.Id,
                            name = p.Category.Name,
                            slug = p.Category.Slug
                        } : null,
                        tags = p.PostTags?.Select(pt => new
                        {
                            id = pt.Tag.Id,
                            name = pt.Tag.Name,
                            slug = pt.Tag.Slug,
                            color = pt.Tag.Color
                        }).ToList()
                    }),
                    pagination = new
                    {
                        currentPage = page,
                        pageSize = pageSize,
                        totalItems = totalPosts,
                        totalPages = (int)Math.Ceiling((double)totalPosts / pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while fetching posts." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            try
            {
                var post = await _postService.GetPostByIdAsync(id);
                if (post == null)
                {
                    return NotFound(new { success = false, message = "Post not found." });
                }

                return Ok(new
                {
                    id = post.Id,
                    title = post.Title,
                    slug = post.Slug,
                    content = post.Content,
                    excerpt = post.Excerpt,
                    featuredImageUrl = post.FeaturedImageUrl,
                    metaTitle = post.MetaTitle,
                    metaDescription = post.MetaDescription,
                    metaKeywords = post.MetaKeywords,
                    status = post.Status.ToString(),
                    publishedAt = post.PublishedAt,
                    scheduledAt = post.ScheduledAt,
                    viewCount = post.ViewCount,
                    allowComments = post.AllowComments,
                    isFeatured = post.IsFeatured,
                    createdAt = post.CreatedAt,
                    updatedAt = post.UpdatedAt,
                    author = new
                    {
                        id = post.Author?.Id,
                        username = post.Author?.Username,
                        firstName = post.Author?.FirstName,
                        lastName = post.Author?.LastName
                    },
                    category = post.Category != null ? new
                    {
                        id = post.Category.Id,
                        name = post.Category.Name,
                        slug = post.Category.Slug
                    } : null,
                    tags = post.PostTags?.Select(pt => new
                    {
                        id = pt.Tag.Id,
                        name = pt.Tag.Name,
                        slug = pt.Tag.Slug,
                        color = pt.Tag.Color
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while fetching the post." });
            }
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetPostBySlug(string slug)
        {
            try
            {
                var post = await _postService.GetPostBySlugAsync(slug);
                if (post == null)
                {
                    return NotFound(new { success = false, message = "Post not found." });
                }

                // Increment view count
                await _postService.IncrementViewCountAsync(post.Id);

                return Ok(new
                {
                    id = post.Id,
                    title = post.Title,
                    slug = post.Slug,
                    content = post.Content,
                    excerpt = post.Excerpt,
                    featuredImageUrl = post.FeaturedImageUrl,
                    metaTitle = post.MetaTitle,
                    metaDescription = post.MetaDescription,
                    metaKeywords = post.MetaKeywords,
                    status = post.Status.ToString(),
                    publishedAt = post.PublishedAt,
                    viewCount = post.ViewCount + 1,
                    allowComments = post.AllowComments,
                    isFeatured = post.IsFeatured,
                    createdAt = post.CreatedAt,
                    updatedAt = post.UpdatedAt,
                    author = new
                    {
                        id = post.Author?.Id,
                        username = post.Author?.Username,
                        firstName = post.Author?.FirstName,
                        lastName = post.Author?.LastName
                    },
                    category = post.Category != null ? new
                    {
                        id = post.Category.Id,
                        name = post.Category.Name,
                        slug = post.Category.Slug
                    } : null,
                    tags = post.PostTags?.Select(pt => new
                    {
                        id = pt.Tag.Id,
                        name = pt.Tag.Name,
                        slug = pt.Tag.Slug,
                        color = pt.Tag.Color
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while fetching the post." });
            }
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedPosts([FromQuery] int limit = 5)
        {
            try
            {
                var posts = await _postService.GetFeaturedPostsAsync(limit);

                return Ok(new
                {
                    data = posts.Select(p => new
                    {
                        id = p.Id,
                        title = p.Title,
                        slug = p.Slug,
                        excerpt = p.Excerpt,
                        featuredImageUrl = p.FeaturedImageUrl,
                        publishedAt = p.PublishedAt,
                        viewCount = p.ViewCount,
                        author = new
                        {
                            id = p.Author?.Id,
                            username = p.Author?.Username,
                            firstName = p.Author?.FirstName,
                            lastName = p.Author?.LastName
                        },
                        category = p.Category != null ? new
                        {
                            id = p.Category.Id,
                            name = p.Category.Name,
                            slug = p.Category.Slug
                        } : null
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while fetching featured posts." });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        {
            try
            {
                var post = await _postService.CreatePostAsync(request.ToPost());
                
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, new
                {
                    success = true,
                    message = "Post created successfully",
                    data = new { id = post.Id, slug = post.Slug }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while creating the post." });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostRequest request)
        {
            try
            {
                var post = await _postService.GetPostByIdAsync(id);
                if (post == null)
                {
                    return NotFound(new { success = false, message = "Post not found." });
                }

                var updatedPost = await _postService.UpdatePostAsync(request.ToPost(id));
                
                return Ok(new
                {
                    success = true,
                    message = "Post updated successfully",
                    data = new { id = updatedPost.Id, slug = updatedPost.Slug }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while updating the post." });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                var result = await _postService.DeletePostAsync(id);
                if (!result)
                {
                    return NotFound(new { success = false, message = "Post not found." });
                }

                return Ok(new { success = true, message = "Post deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while deleting the post." });
            }
        }
    }

    // DTOs
    public class CreatePostRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public string? FeaturedImageUrl { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public PostStatus Status { get; set; } = PostStatus.Draft;
        public DateTime? ScheduledAt { get; set; }
        public bool AllowComments { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        public int AuthorId { get; set; }
        public int? CategoryId { get; set; }
        public List<int> TagIds { get; set; } = new();

        public Post ToPost()
        {
            return new Post
            {
                Title = Title,
                Content = Content,
                Excerpt = Excerpt,
                FeaturedImageUrl = FeaturedImageUrl,
                MetaTitle = MetaTitle,
                MetaDescription = MetaDescription,
                MetaKeywords = MetaKeywords,
                Status = Status,
                ScheduledAt = ScheduledAt,
                AllowComments = AllowComments,
                IsFeatured = IsFeatured,
                AuthorId = AuthorId,
                CategoryId = CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }
    }

    public class UpdatePostRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public string? FeaturedImageUrl { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public PostStatus Status { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public bool AllowComments { get; set; }
        public bool IsFeatured { get; set; }
        public int? CategoryId { get; set; }
        public List<int> TagIds { get; set; } = new();

        public Post ToPost(int id)
        {
            return new Post
            {
                Id = id,
                Title = Title,
                Content = Content,
                Excerpt = Excerpt,
                FeaturedImageUrl = FeaturedImageUrl,
                MetaTitle = MetaTitle,
                MetaDescription = MetaDescription,
                MetaKeywords = MetaKeywords,
                Status = Status,
                ScheduledAt = ScheduledAt,
                AllowComments = AllowComments,
                IsFeatured = IsFeatured,
                CategoryId = CategoryId,
                UpdatedAt = DateTime.UtcNow
            };
        }
    }
} 