# Use the official .NET 8 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["CodexCMS.Web/CodexCMS.Web.csproj", "CodexCMS.Web/"]
COPY ["CodexCMS.Core/CodexCMS.Core.csproj", "CodexCMS.Core/"]
COPY ["CodexCMS.Data/CodexCMS.Data.csproj", "CodexCMS.Data/"]

# Restore dependencies
RUN dotnet restore "CodexCMS.Web/CodexCMS.Web.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/CodexCMS.Web"
RUN dotnet build "CodexCMS.Web.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "CodexCMS.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create directory for SQLite database
RUN mkdir -p /app/data && chmod 777 /app/data

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:$PORT

# Expose port (Railway will set this dynamically)
EXPOSE $PORT

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

ENTRYPOINT ["dotnet", "CodexCMS.Web.dll"] 