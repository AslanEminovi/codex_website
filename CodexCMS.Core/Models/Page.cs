using System.ComponentModel.DataAnnotations;

namespace CodexCMS.Core.Models
{
    public class Page
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        
        [Required]
        public PageStatus Status { get; set; } = PageStatus.Draft;
        
        public bool IsHomePage { get; set; } = false;
        public int DisplayOrder { get; set; } = 0;
        
        public DateTime? PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign keys
        public int AuthorId { get; set; }
        
        // Navigation properties
        public virtual User Author { get; set; } = null!;
    }
    
    public enum PageStatus
    {
        Draft,
        Published,
        Archived
    }
} 