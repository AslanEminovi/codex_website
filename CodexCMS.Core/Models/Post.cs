using System.ComponentModel.DataAnnotations;

namespace CodexCMS.Core.Models
{
    public class Post
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Excerpt { get; set; }
        
        public string? FeaturedImageUrl { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        
        [Required]
        public PostStatus Status { get; set; } = PostStatus.Draft;
        
        public DateTime? PublishedAt { get; set; }
        public DateTime? ScheduledAt { get; set; }
        
        public int ViewCount { get; set; } = 0;
        public bool AllowComments { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign keys
        public int AuthorId { get; set; }
        public int? CategoryId { get; set; }
        
        // Navigation properties
        public virtual User Author { get; set; } = null!;
        public virtual Category? Category { get; set; }
        public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
        public virtual ICollection<Media> Media { get; set; } = new List<Media>();
    }
    
    public enum PostStatus
    {
        Draft,
        PendingReview,
        Published,
        Archived
    }
} 