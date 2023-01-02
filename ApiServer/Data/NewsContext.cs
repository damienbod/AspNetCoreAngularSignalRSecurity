using ApiServer.Providers;
using Microsoft.EntityFrameworkCore;

namespace ApiServer.Data;

public class NewsContext : DbContext
{
    public NewsContext(DbContextOptions<NewsContext> options) :base(options) { }

    public DbSet<NewsItemEntity> NewsItemEntities => Set<NewsItemEntity>();
    public DbSet<NewsGroup> NewsGroups => Set<NewsGroup>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<NewsItemEntity>().HasKey(m => m.Id);
        builder.Entity<NewsGroup>().HasKey(m => m.Id);
        base.OnModelCreating(builder);
    }


 

  


}