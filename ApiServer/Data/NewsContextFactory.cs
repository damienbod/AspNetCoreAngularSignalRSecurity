using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ApiServer.Data;

/// <summary>
/// Required for migrations
/// </summary>
public class NewsContextFactory : IDesignTimeDbContextFactory<NewsContext>
{
    public NewsContext CreateDbContext(string[] args)
    {
        var deploymentType = 
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", EnvironmentVariableTarget.Machine);

        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{deploymentType}.json", optional: true)
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        var optionsBuilder = new DbContextOptionsBuilder<NewsContext>();
        optionsBuilder.UseSqlite(connectionString);

        return new NewsContext(optionsBuilder.Options);
    }
}