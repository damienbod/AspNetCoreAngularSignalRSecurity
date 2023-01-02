using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ApiServer.Data;

/// <summary>
/// Required for migrations
/// </summary>
public class DataEventRecordContextFactory : IDesignTimeDbContextFactory<DataEventRecordContext>
{
    public DataEventRecordContext CreateDbContext(string[] args)
    {
        var deploymentType = 
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", EnvironmentVariableTarget.Machine);

        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{deploymentType}.json", optional: true)
            .Build();

        var connectionString = configuration.GetConnectionString("SqliteConnectionString");
        var optionsBuilder = new DbContextOptionsBuilder<DataEventRecordContext>();
        optionsBuilder.UseSqlite(connectionString);

        return new DataEventRecordContext(optionsBuilder.Options);
    }
}