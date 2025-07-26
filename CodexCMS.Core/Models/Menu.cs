using System.ComponentModel.DataAnnotations;

namespace CodexCMS.Core.Models
{
    public class Menu
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Location { get; set; } = string.Empty; // "header", "footer", "sidebar"
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
    
    public class MenuItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Url { get; set; }
        
        public int? ParentMenuItemId { get; set; }
        public int DisplayOrder { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        public bool OpenInNewTab { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign keys
        public int MenuId { get; set; }
        
        // Navigation properties
        public virtual Menu Menu { get; set; } = null!;
        public virtual MenuItem? ParentMenuItem { get; set; }
        public virtual ICollection<MenuItem> SubMenuItems { get; set; } = new List<MenuItem>();
    }
} 