# Use the official .NET 8 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files for API
COPY ["codex-api/CodexCMS.API/CodexCMS.API.csproj", "codex-api/CodexCMS.API/"]
COPY ["codex-api/CodexCMS.Core/CodexCMS.Core.csproj", "codex-api/CodexCMS.Core/"]
COPY ["codex-api/CodexCMS.Data/CodexCMS.Data.csproj", "codex-api/CodexCMS.Data/"]

# Restore dependencies
RUN dotnet restore "codex-api/CodexCMS.API/CodexCMS.API.csproj"

# Copy all source code
COPY . .

# Build the API application
WORKDIR "/src/codex-api/CodexCMS.API"
RUN dotnet build "CodexCMS.API.csproj" -c Release -o /app/build

# Publish the API application
FROM build AS publish
RUN dotnet publish "CodexCMS.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create directory for SQLite database (if needed for fallback)
RUN mkdir -p /app/data && chmod 777 /app/data

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:$PORT

# Expose port (Railway will set this dynamically)
EXPOSE $PORT

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

ENTRYPOINT ["dotnet", "CodexCMS.API.dll"] 