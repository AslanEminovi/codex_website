using Microsoft.EntityFrameworkCore;
using CodexCMS.Core.Models;

namespace CodexCMS.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Media> Media { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired();
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasOne(e => e.ParentCategory)
                      .WithMany(e => e.SubCategories)
                      .HasForeignKey(e => e.ParentCategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Tag configuration
            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // Post configuration
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasOne(e => e.Author)
                      .WithMany(e => e.Posts)
                      .HasForeignKey(e => e.AuthorId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Category)
                      .WithMany(e => e.Posts)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // PostTag configuration (many-to-many)
            modelBuilder.Entity<PostTag>(entity =>
            {
                entity.HasKey(e => new { e.PostId, e.TagId });
                entity.HasOne(e => e.Post)
                      .WithMany(e => e.PostTags)
                      .HasForeignKey(e => e.PostId);
                entity.HasOne(e => e.Tag)
                      .WithMany(e => e.PostTags)
                      .HasForeignKey(e => e.TagId);
            });

            // Page configuration
            modelBuilder.Entity<Page>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasOne(e => e.Author)
                      .WithMany(e => e.Pages)
                      .HasForeignKey(e => e.AuthorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Media configuration
            modelBuilder.Entity<Media>(entity =>
            {
                entity.HasOne(e => e.UploadedBy)
                      .WithMany()
                      .HasForeignKey(e => e.UploadedById)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Menu configuration
            modelBuilder.Entity<Menu>(entity =>
            {
                entity.HasIndex(e => new { e.Name, e.Location }).IsUnique();
            });

            // MenuItem configuration
            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.HasOne(e => e.Menu)
                      .WithMany(e => e.MenuItems)
                      .HasForeignKey(e => e.MenuId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.ParentMenuItem)
                      .WithMany(e => e.SubMenuItems)
                      .HasForeignKey(e => e.ParentMenuItemId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
} 