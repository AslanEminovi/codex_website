using System.ComponentModel.DataAnnotations;

namespace CodexCMS.Core.Models
{
    public class Media
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(255)]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string FilePath { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string ContentType { get; set; } = string.Empty;
        
        public long FileSize { get; set; }
        
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? AltText { get; set; }
        
        public int? Width { get; set; }
        public int? Height { get; set; }
        
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public int UploadedById { get; set; }
        
        // Navigation properties
        public virtual User UploadedBy { get; set; } = null!;
    }
} 