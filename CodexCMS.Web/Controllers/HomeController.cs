using Microsoft.AspNetCore.Mvc;
using CodexCMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CodexCMS.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var featuredPosts = await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
                .Where(p => p.Status == Core.Models.PostStatus.Published && p.IsFeatured)
                .OrderByDescending(p => p.PublishedAt)
                .Take(6)
                .ToListAsync();

            var recentPosts = await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Category)
                .Where(p => p.Status == Core.Models.PostStatus.Published)
                .OrderByDescending(p => p.PublishedAt)
                .Take(3)
                .ToListAsync();

            var categories = await _context.Categories
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .Take(6)
                .ToListAsync();

            ViewBag.FeaturedPosts = featuredPosts;
            ViewBag.RecentPosts = recentPosts;
            ViewBag.Categories = categories;

            return View();
        }

        public async Task<IActionResult> About()
        {
            var page = await _context.Pages
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Slug == "about" && p.Status == Core.Models.PageStatus.Published);

            if (page == null)
            {
                return NotFound();
            }

            return View(page);
        }

        public async Task<IActionResult> Contact()
        {
            var page = await _context.Pages
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Slug == "contact" && p.Status == Core.Models.PageStatus.Published);

            if (page == null)
            {
                return NotFound();
            }

            return View(page);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Terms()
        {
            return View();
        }
    }
} 