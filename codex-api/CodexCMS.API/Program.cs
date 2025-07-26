using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using CodexCMS.Data;
using CodexCMS.API.Services;

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

// Database configuration - temporarily use SQLite until we solve PostgreSQL connection
Console.WriteLine("📁 Using SQLite temporarily for testing website registration");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=codexcms.db"));

// JWT Configuration
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? 
             builder.Configuration["Jwt:Key"] ?? 
             "YourDefaultSecretKeyForDevelopmentOnlyMustBeAtLeast32Characters";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
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

var app = builder.Build();

// Always enable Swagger for debugging
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CodexCMS API V1");
    c.RoutePrefix = string.Empty; // Makes Swagger available at root
});

// Enable CORS
app.UseCors("AllowFrontend");

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
        
        // Try to ensure created
        var created = await context.Database.EnsureCreatedAsync();
        logger.LogInformation($"Database ensured created: {created}");
        
        // Check if Users table exists
        var hasUsers = await context.Users.AnyAsync();
        logger.LogInformation($"Users table accessible: {hasUsers}");
        
        // Try seeding if no users exist
        if (!hasUsers)
        {
            logger.LogInformation("No users found, attempting to seed...");
            await CodexCMS.API.Helpers.SeedData.InitializeAsync(context);
            logger.LogInformation("Seeding completed");
        }
        
        return Results.Ok(new { 
            canConnect, 
            created, 
            hasUsers,
            message = "Database initialization completed" 
        });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database initialization failed: {Message}", ex.Message);
        return Results.BadRequest(new { 
            error = ex.Message, 
            innerError = ex.InnerException?.Message 
        });
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

app.Run();
