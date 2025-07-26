using CodexCMS.Core.Models;
using CodexCMS.Data;
using BCrypt.Net;

namespace CodexCMS.Web.Helpers
{
    public static class SeedData
    {
        public static async Task InitializeAsync(ApplicationDbContext context)
        {
            // Check if data already exists
            if (context.Users.Any())
            {
                return;
            }

            // Create admin user
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@codexcms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FirstName = "Admin",
                LastName = "User",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);

            // Create sample categories
            var technologyCategory = new Category
            {
                Name = "Technology",
                Description = "Technology related articles",
                Slug = "technology",
                IsActive = true,
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var lifestyleCategory = new Category
            {
                Name = "Lifestyle",
                Description = "Lifestyle and personal development articles",
                Slug = "lifestyle",
                IsActive = true,
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Categories.AddRange(technologyCategory, lifestyleCategory);

            // Create sample tags
            var tags = new List<Tag>
            {
                new Tag { Name = "Programming", Slug = "programming", Description = "Programming related content", Color = "#007bff", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Tag { Name = "Web Development", Slug = "web-development", Description = "Web development articles", Color = "#28a745", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Tag { Name = "Productivity", Slug = "productivity", Description = "Productivity tips and tricks", Color = "#ffc107", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Tag { Name = "Health", Slug = "health", Description = "Health and wellness", Color = "#dc3545", IsActive = true, CreatedAt = DateTime.UtcNow }
            };

            context.Tags.AddRange(tags);

            await context.SaveChangesAsync();

            // Create sample posts
            var samplePost = new Post
            {
                Title = "Welcome to CodexCMS",
                Slug = "welcome-to-codexcms",
                Content = "<p>Welcome to your new content management system! This is a sample post to get you started.</p><p>You can edit this post or create new ones through the admin panel.</p>",
                Excerpt = "Welcome to your new content management system! This is a sample post to get you started.",
                Status = PostStatus.Published,
                PublishedAt = DateTime.UtcNow,
                ViewCount = 0,
                AllowComments = true,
                IsFeatured = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                AuthorId = adminUser.Id,
                CategoryId = technologyCategory.Id
            };

            context.Posts.Add(samplePost);

            // Create sample pages
            var aboutPage = new Page
            {
                Title = "About Us",
                Slug = "about",
                Content = "<h2>About CodexCMS</h2><p>CodexCMS is a modern content management system built with ASP.NET Core and Entity Framework.</p><p>It features a beautiful liquid glass UI design and comprehensive content management capabilities.</p>",
                Status = PageStatus.Published,
                PublishedAt = DateTime.UtcNow,
                IsHomePage = false,
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                AuthorId = adminUser.Id
            };

            var contactPage = new Page
            {
                Title = "Contact",
                Slug = "contact",
                Content = "<h2>Contact Us</h2><p>Get in touch with us for any questions or support.</p><p>Email: contact@codexcms.com</p>",
                Status = PageStatus.Published,
                PublishedAt = DateTime.UtcNow,
                IsHomePage = false,
                DisplayOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                AuthorId = adminUser.Id
            };

            context.Pages.AddRange(aboutPage, contactPage);

            // Create sample menus
            var headerMenu = new Menu
            {
                Name = "Header Menu",
                Location = "header",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var footerMenu = new Menu
            {
                Name = "Footer Menu",
                Location = "footer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Menus.AddRange(headerMenu, footerMenu);

            await context.SaveChangesAsync();

            // Create menu items
            var headerMenuItems = new List<MenuItem>
            {
                new MenuItem { Title = "Home", Url = "/", DisplayOrder = 1, IsActive = true, CreatedAt = DateTime.UtcNow, MenuId = headerMenu.Id },
                new MenuItem { Title = "Blog", Url = "/blog", DisplayOrder = 2, IsActive = true, CreatedAt = DateTime.UtcNow, MenuId = headerMenu.Id },
                new MenuItem { Title = "About", Url = "/about", DisplayOrder = 3, IsActive = true, CreatedAt = DateTime.UtcNow, MenuId = headerMenu.Id },
                new MenuItem { Title = "Contact", Url = "/contact", DisplayOrder = 4, IsActive = true, CreatedAt = DateTime.UtcNow, MenuId = headerMenu.Id }
            };

            var footerMenuItems = new List<MenuItem>
            {
                new MenuItem { Title = "Privacy Policy", Url = "/privacy", DisplayOrder = 1, IsActive = true, CreatedAt = DateTime.UtcNow, MenuId = footerMenu.Id },
                new MenuItem { Title = "Terms of Service", Url = "/terms", DisplayOrder = 2, IsActive = true, CreatedAt = DateTime.UtcNow, MenuId = footerMenu.Id }
            };

            context.MenuItems.AddRange(headerMenuItems);
            context.MenuItems.AddRange(footerMenuItems);

            await context.SaveChangesAsync();
        }
    }
} 