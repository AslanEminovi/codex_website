using System.ComponentModel.DataAnnotations;

namespace CodexCMS.Core.Models
{
    public class Tag
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Slug { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Description { get; set; }
        
        public string? Color { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
    }
} 