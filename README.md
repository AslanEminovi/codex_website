# CodexCMS - Modern Content Management System

A beautiful, modern content management system built with ASP.NET Core and featuring a stunning liquid glass UI design.

## 🌟 Features

### 🔐 Authentication & User Management

- **User Registration & Login**: Secure user authentication with JWT tokens
- **Role-based Authorization**: Admin, Editor, Author, and Contributor roles
- **Password Reset**: Forgot password functionality with email support
- **User Profiles**: Complete user profile management

### 📝 Content Management

- **Blog Posts**: Create, edit, and manage blog content
- **Static Pages**: About, Contact, and custom pages
- **Content Scheduling**: Schedule posts for future publication
- **Draft System**: Save and manage draft content
- **Rich Text Editor**: Enhanced content editing experience

### 🏷️ Categories & Tags

- **Hierarchical Categories**: Support for parent-child category relationships
- **Multiple Tags**: Assign multiple tags to posts
- **Tag Management**: Color-coded tags with descriptions
- **Category Management**: Organize content with categories

### 📁 Media Management

- **File Upload**: Upload and manage images and files
- **Media Library**: Browse and organize uploaded media
- **Image Optimization**: Automatic image processing
- **File Management**: Delete and organize media files

### 🧭 Menu Management

- **Header Menus**: Create and manage navigation menus
- **Footer Menus**: Footer link management
- **Menu Items**: Add, edit, and organize menu items
- **Hierarchical Menus**: Support for dropdown menus

### 🎨 Beautiful UI

- **Liquid Glass Design**: Modern glassmorphism styling
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Themes**: Theme switching capability
- **Smooth Animations**: CSS animations and transitions
- **Bootstrap 5**: Latest Bootstrap framework

## 🚀 Quick Start

### Prerequisites

- .NET 8.0 SDK
- SQL Server (LocalDB, Express, or Full)
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/CodexCMS.git
   cd CodexCMS
   ```

2. **Restore dependencies**

   ```bash
   dotnet restore
   ```

3. **Update database connection**
   Edit `CodexCMS.Web/appsettings.json` and update the connection string:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CodexCMS;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Run the application**

   ```bash
   cd CodexCMS.Web
   dotnet run
   ```

5. **Access the application**
   - Public Site: `https://localhost:5001`
   - Admin Panel: Login with default credentials
     - Username: `admin`
     - Password: `Admin123!`

## 📁 Project Structure

```
CodexCMS/
├── CodexCMS.Core/           # Domain models and entities
│   ├── Models/              # Entity models
│   └── CodexCMS.Core.csproj
├── CodexCMS.Data/           # Data access layer
│   ├── ApplicationDbContext.cs
│   └── CodexCMS.Data.csproj
├── CodexCMS.Web/            # Web application
│   ├── Controllers/         # MVC Controllers
│   ├── Views/               # Razor Views
│   ├── Models/              # View Models
│   ├── Services/            # Business logic services
│   ├── wwwroot/             # Static files
│   │   ├── css/             # Stylesheets
│   │   └── js/              # JavaScript files
│   └── CodexCMS.Web.csproj
└── CodexCMS.sln             # Solution file
```

## 🎨 UI Components

### Liquid Glass Styling

The application features a modern glassmorphism design with:

- **Backdrop Blur**: Frosted glass effects
- **Transparency**: Semi-transparent elements
- **Gradients**: Beautiful color gradients
- **Shadows**: Subtle depth and elevation
- **Animations**: Smooth hover and transition effects

### Color Scheme

- **Primary**: `#667eea` (Blue gradient)
- **Secondary**: `#764ba2` (Purple gradient)
- **Accent**: `#f093fb` (Pink gradient)
- **Success**: `#4facfe` (Light blue)
- **Warning**: `#43e97b` (Green)
- **Danger**: `#fa709a` (Pink)

## 🔧 Configuration

### JWT Settings

Update the JWT configuration in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong",
    "Issuer": "CodexCMS",
    "Audience": "CodexCMSUsers",
    "ExpiryInMinutes": 60
  }
}
```

### Database

The application uses Entity Framework Core with SQL Server. The database will be created automatically on first run.

## 📚 API Documentation

### Authentication Endpoints

- `POST /Auth/Login` - User login
- `POST /Auth/Register` - User registration
- `POST /Auth/ForgotPassword` - Password reset request
- `POST /Auth/ResetPassword` - Password reset

### Content Endpoints

- `GET /Blog` - List all blog posts
- `GET /Blog/{slug}` - Get specific post
- `GET /Category/{slug}` - Get posts by category
- `GET /Tag/{slug}` - Get posts by tag

## 🛠️ Development

### Adding New Features

1. Create domain models in `CodexCMS.Core/Models/`
2. Add DbSet to `ApplicationDbContext`
3. Create service interfaces and implementations
4. Add controllers and views
5. Update navigation and routing

### Database Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName --project CodexCMS.Data --startup-project CodexCMS.Web

# Update database
dotnet ef database update --project CodexCMS.Data --startup-project CodexCMS.Web
```

## 🚀 Deployment

### Production Setup

1. Update connection string for production database
2. Set environment variables for JWT keys
3. Configure HTTPS certificates
4. Set up reverse proxy (nginx/Apache)
5. Configure logging and monitoring

### Docker Support

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CodexCMS.Web/CodexCMS.Web.csproj", "CodexCMS.Web/"]
COPY ["CodexCMS.Core/CodexCMS.Core.csproj", "CodexCMS.Core/"]
COPY ["CodexCMS.Data/CodexCMS.Data.csproj", "CodexCMS.Data/"]
RUN dotnet restore "CodexCMS.Web/CodexCMS.Web.csproj"
COPY . .
WORKDIR "/src/CodexCMS.Web"
RUN dotnet build "CodexCMS.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CodexCMS.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CodexCMS.Web.dll"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bootstrap 5** for the responsive framework
- **Bootstrap Icons** for beautiful icons
- **Inter Font** for typography
- **ASP.NET Core** for the robust backend framework

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Email: support@codexcms.com
- Documentation: [docs.codexcms.com](https://docs.codexcms.com)

---

**Made with ❤️ using ASP.NET Core and modern web technologies**
# codex_website
