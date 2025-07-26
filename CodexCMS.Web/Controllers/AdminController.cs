using Microsoft.AspNetCore.Mvc;
using CodexCMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CodexCMS.Web.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Dashboard()
        {
            // Get statistics
            var totalPosts = await _context.Posts.CountAsync();
            var publishedPosts = await _context.Posts.CountAsync(p => p.Status == Core.Models.PostStatus.Published);
            var draftPosts = await _context.Posts.CountAsync(p => p.Status == Core.Models.PostStatus.Draft);
            var totalCategories = await _context.Categories.CountAsync();
            var totalTags = await _context.Tags.CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            var totalPages = await _context.Pages.CountAsync();
            var totalMedia = await _context.Media.CountAsync();

            // Get recent posts
            var recentPosts = await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .ToListAsync();

            // Get recent users
            var recentUsers = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .ToListAsync();

            ViewBag.TotalPosts = totalPosts;
            ViewBag.PublishedPosts = publishedPosts;
            ViewBag.DraftPosts = draftPosts;
            ViewBag.TotalCategories = totalCategories;
            ViewBag.TotalTags = totalTags;
            ViewBag.TotalUsers = totalUsers;
            ViewBag.TotalPages = totalPages;
            ViewBag.TotalMedia = totalMedia;
            ViewBag.RecentPosts = recentPosts;
            ViewBag.RecentUsers = recentUsers;

            return View();
        }
    }
} 