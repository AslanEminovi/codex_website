# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY CodexCMS.API/CodexCMS.API.csproj CodexCMS.API/
COPY CodexCMS.Core/CodexCMS.Core.csproj CodexCMS.Core/
COPY CodexCMS.Data/CodexCMS.Data.csproj CodexCMS.Data/

# Restore dependencies
RUN dotnet restore CodexCMS.API/CodexCMS.API.csproj

# Copy source code
COPY . .

# Build the application
WORKDIR /src/CodexCMS.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create data directory for SQLite
RUN mkdir -p /app/data && chmod 777 /app/data

# Copy published app
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:$PORT

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

ENTRYPOINT ["dotnet", "CodexCMS.API.dll"] 