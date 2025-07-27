using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using CodexCMS.Data;
using CodexCMS.API.Services;
using Microsoft.AspNetCore.Mvc;
using CodexCMS.Core.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure port for Railway deployment
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "CodexCMS API", 
        Version = "v1",
        Description = "A modern CMS API built with ASP.NET Core"
    });
    
    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// Database configuration - use PostgreSQL with the connection string you provided
var connectionString = "postgresql://postgres:tsnNQYCddaolpYWrLGISSrOwCGiyFQWD@tramway.proxy.rlwy.net:39101/railway";
Console.WriteLine($"🐘 Using PostgreSQL: {connectionString.Substring(0, 30)}...");

try 
{
    var uri = new Uri(connectionString);
    var npgsqlConnectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]};SSL Mode=Prefer;Trust Server Certificate=true;";
    
    Console.WriteLine($"🔗 Connecting to: {uri.Host}:{uri.Port}");
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(npgsqlConnectionString));
}
catch (Exception ex)
{
    Console.WriteLine($"❌ PostgreSQL connection failed: {ex.Message}");
    throw; // Don't fall back, just fail hard so we know what's wrong
}

// JWT Configuration
var jwtKeyString = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? 
                   builder.Configuration["Jwt:Key"] ?? 
                   "YourDefaultSecretKeyForDevelopmentOnlyMustBeAtLeast32CharactersLongToMeet256BitRequirement123456789";

// Handle base64 encoded keys properly
byte[] jwtKeyBytes;
try 
{
    // Try to decode as base64 first
    jwtKeyBytes = Convert.FromBase64String(jwtKeyString);
    Console.WriteLine($"🔑 Using base64 decoded JWT key: {jwtKeyBytes.Length * 8} bits");
}
catch 
{
    // If not base64, use as string but ensure minimum length
    if (jwtKeyString.Length < 32)
    {
        jwtKeyString = "YourDefaultSecretKeyForDevelopmentOnlyMustBeAtLeast32CharactersLongToMeet256BitRequirement123456789";
    }
    jwtKeyBytes = System.Text.Encoding.UTF8.GetBytes(jwtKeyString);
    Console.WriteLine($"🔑 Using string JWT key: {jwtKeyBytes.Length * 8} bits");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtKeyBytes),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS Configuration for Next.js frontend - UPDATED for better wildcard support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            // Allow localhost for development
            if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:"))
                return true;
            
            // Allow all Vercel deployments
            if (origin.EndsWith(".vercel.app"))
                return true;
            
            // Allow specific production domains
            var allowedDomains = new[]
            {
                "https://codex-cms.vercel.app",
                "https://codexcms.vercel.app",
                "https://codex-website.vercel.app",
                "https://codex-website-one.vercel.app"
            };
            
            return allowedDomains.Contains(origin);
        })
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Custom services - only keeping AuthService to avoid build errors
builder.Services.AddScoped<IAuthService, AuthService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Build the app
var app = builder.Build();

// Initialize database on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("🔄 Ensuring database is created...");
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("✅ Database ensured");
        
        // Seed basic data if tables are empty
        if (!await context.Categories.AnyAsync())
        {
            logger.LogInformation("🌱 Seeding basic categories...");
            var generalCategory = new Category
            {
                Name = "General",
                Slug = "general",
                Description = "General posts",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Categories.Add(generalCategory);
            await context.SaveChangesAsync();
            logger.LogInformation("✅ Categories seeded");
        }
        
        // Create admin user if doesn't exist
        if (!await context.Users.AnyAsync(u => u.Email == "eminoviaslan@gmail.com"))
        {
            logger.LogInformation("🌱 Creating admin user...");
            var adminUser = new User
            {
                Username = "admin",
                Email = "eminoviaslan@gmail.com",
                FirstName = "Aslan",
                LastName = "Eminovi",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
            logger.LogInformation("✅ Admin user created");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ Database initialization failed: {Message}", ex.Message);
    }
}

// Always enable Swagger for debugging
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CodexCMS API V1");
    c.RoutePrefix = string.Empty; // Makes Swagger available at root
});

// Enable CORS
app.UseCors("AllowFrontend");

// Manual database initialization endpoint
app.MapPost("/api/init-db", async (ApplicationDbContext context, ILogger<Program> logger) =>
{
    try
    {
        logger.LogInformation("🔄 Manual database initialization started...");
        
        // Force database creation
        var created = await context.Database.EnsureCreatedAsync();
        logger.LogInformation($"Database creation result: {created}");
        
        // Check if Categories table exists and seed
        if (!await context.Categories.AnyAsync())
        {
            logger.LogInformation("🌱 Seeding categories...");
            var categories = new[]
            {
                new Category { Name = "General", Slug = "general", Description = "General posts", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Name = "Technology", Slug = "technology", Description = "Technology posts", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
            logger.LogInformation("✅ Categories seeded");
        }
        
        // Check if admin user exists and create
        if (!await context.Users.AnyAsync(u => u.Email == "eminoviaslan@gmail.com"))
        {
            logger.LogInformation("🌱 Creating admin user...");
            var adminUser = new User
            {
                Username = "admin",
                Email = "eminoviaslan@gmail.com",
                FirstName = "Aslan",
                LastName = "Eminovi",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
            logger.LogInformation("✅ Admin user created");
        }
        
        return Results.Ok(new { 
            message = "Database initialized successfully",
            tablesCreated = created,
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ Database initialization failed");
        return Results.BadRequest(new { 
            error = ex.Message,
            innerError = ex.InnerException?.Message,
            timestamp = DateTime.UtcNow
        });
    }
});

app.UseAuthentication();
app.UseAuthorization();

// Debug endpoints
app.MapGet("/debug/routes", () =>
{
    return Results.Ok(new
    {
        message = "API is running",
        environment = app.Environment.EnvironmentName,
        routes = new[]
        {
            "/api/auth/login",
            "/api/auth/register", 
            "/api/posts",
            "/health",
            "/init-db"
        }
    });
});

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => "OK");

// Database initialization endpoint for debugging
app.MapGet("/init-db", async (ApplicationDbContext context, ILogger<Program> logger) =>
{
    try
    {
        logger.LogInformation("Manual database initialization started...");
        
        // Check if we can connect
        var canConnect = await context.Database.CanConnectAsync();
        logger.LogInformation($"Can connect to database: {canConnect}");
        
        if (!canConnect)
        {
            return Results.BadRequest("Cannot connect to database");
        }
        
        // DELETE DATABASE AND RECREATE TO ENSURE FRESH START
        logger.LogInformation("Deleting and recreating database...");
        await context.Database.EnsureDeletedAsync();
        var created = await context.Database.EnsureCreatedAsync();
        logger.LogInformation($"Database recreated: {created}");
        
        // Force migrations
        try 
        {
            await context.Database.MigrateAsync();
            logger.LogInformation("Migrations applied successfully");
        }
        catch (Exception migEx)
        {
            logger.LogWarning($"Migration warning: {migEx.Message}");
        }
        
        // Check if Users table exists by trying to query it
        bool hasUsersTable = false;
        try 
        {
            var userCount = await context.Users.CountAsync();
            hasUsersTable = true;
            logger.LogInformation($"Users table exists with {userCount} users");
        }
        catch (Exception ex)
        {
            logger.LogError($"Users table check failed: {ex.Message}");
        }
        
        // Try seeding if table exists but no users
        if (hasUsersTable)
        {
            var userCount = await context.Users.CountAsync();
            if (userCount == 0)
            {
                logger.LogInformation("No users found, attempting to seed...");
                await CodexCMS.API.Helpers.SeedData.InitializeAsync(context);
                logger.LogInformation("Seeding completed");
                userCount = await context.Users.CountAsync();
                logger.LogInformation($"Users after seeding: {userCount}");
            }
        }
        
        return Results.Ok(new { 
            canConnect, 
            created, 
            hasUsersTable,
            message = "Database initialization completed"
        });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database initialization failed");
        return Results.BadRequest(new { error = ex.Message, stackTrace = ex.StackTrace });
    }
});

// Debug endpoint to check users in database
app.MapGet("/debug/users", async (ApplicationDbContext context) =>
{
    try
    {
        var users = await context.Users.Select(u => new { 
            u.Id, 
            u.Username, 
            u.Email, 
            u.CreatedAt,
            PasswordHashLength = u.PasswordHash.Length
        }).ToListAsync();
        
        return Results.Ok(new { 
            userCount = users.Count,
            users = users
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// Admin setup endpoint - make specific user admin
app.MapPost("/admin/setup", async (ApplicationDbContext context) =>
{
    try
    {
        // Make eminoviaslan@gmail.com admin
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "eminoviaslan@gmail.com");
        if (user != null)
        {
            user.Role = UserRole.Admin;
            await context.SaveChangesAsync();
            return Results.Ok(new { success = true, message = $"User {user.Email} is now admin" });
        }
        
        return Results.NotFound(new { success = false, message = "User not found" });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { success = false, error = ex.Message });
    }
});

// Get all users for admin management
app.MapGet("/admin/users", async (ApplicationDbContext context) =>
{
    try
    {
        var users = await context.Users.Select(u => new { 
            u.Id, 
            u.Username, 
            u.Email, 
            u.FirstName,
            u.LastName,
            u.Role,
            u.IsActive,
            u.CreatedAt,
            u.LastLoginAt
        }).ToListAsync();
        
        return Results.Ok(users);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// Update user role (admin only)
app.MapPut("/admin/users/{id}/role", async (int id, [FromBody] UpdateUserRoleRequest request, ApplicationDbContext context) =>
{
    try
    {
        var user = await context.Users.FindAsync(id);
        if (user == null)
        {
            return Results.NotFound(new { message = "User not found" });
        }
        
        user.Role = request.Role;
        await context.SaveChangesAsync();
        
        return Results.Ok(new { success = true, message = $"User role updated to {request.Role}" });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// Delete user (admin only)
app.MapDelete("/admin/users/{id}", async (int id, ApplicationDbContext context) =>
{
    try
    {
        var user = await context.Users.FindAsync(id);
        if (user == null)
        {
            return Results.NotFound(new { message = "User not found" });
        }
        
        // Don't allow deleting the main admin
        if (user.Email == "eminoviaslan@gmail.com")
        {
            return Results.BadRequest(new { message = "Cannot delete main admin user" });
        }
        
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        
        return Results.Ok(new { success = true, message = "User deleted successfully" });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// Database initialization
Task.Run(async () =>
{
    try 
    {
        await Task.Delay(5000); // Wait for app to start
        Console.WriteLine("🚀 Starting database initialization...");
        
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        // Test connection
        var canConnect = await context.Database.CanConnectAsync();
        Console.WriteLine($"📡 Can connect to database: {canConnect}");
        
        if (!canConnect)
        {
            Console.WriteLine("❌ Cannot connect to database");
            return;
        }
        
        // ENSURE DATABASE AND TABLES ARE CREATED
        Console.WriteLine("🔨 Creating database and tables...");
        await context.Database.EnsureCreatedAsync();
        
        // Also run migrations as backup
        try 
        {
            await context.Database.MigrateAsync();
            Console.WriteLine("✅ Database migrations applied");
        }
        catch (Exception migEx)
        {
            Console.WriteLine($"⚠️ Migration warning: {migEx.Message}");
        }
        
        // Initialize data
        await CodexCMS.API.Helpers.SeedData.InitializeAsync(context);
        Console.WriteLine("✅ Database initialization completed successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database initialization failed: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
    }
});

// Database connection test endpoint
app.MapGet("/test-db", async () =>
{
    try
    {
        var connectionString = $"Data Source=/tmp/codexcms.db";
        Console.WriteLine($"Testing connection string: {connectionString}");
        
        // Test raw SQLite connection
        using (var connection = new Microsoft.Data.Sqlite.SqliteConnection(connectionString))
        {
            await connection.OpenAsync();
            Console.WriteLine("✅ Raw SQLite connection successful");
            
            // Test creating a simple table
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "CREATE TABLE IF NOT EXISTS TestTable (id INTEGER PRIMARY KEY, name TEXT)";
                await command.ExecuteNonQueryAsync();
                Console.WriteLine("✅ Table creation successful");
            }
            
            // Test inserting data
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "INSERT INTO TestTable (name) VALUES ('test')";
                await command.ExecuteNonQueryAsync();
                Console.WriteLine("✅ Data insertion successful");
            }
            
            connection.Close();
        }
        
        return Results.Ok(new { 
            success = true, 
            message = "Raw SQLite connection test passed",
            path = "/tmp/codexcms.db"
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database test failed: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        return Results.BadRequest(new { 
            success = false, 
            error = ex.Message,
            stackTrace = ex.StackTrace
        });
    }
});

app.Run();
