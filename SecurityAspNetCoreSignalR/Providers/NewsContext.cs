using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreAngularSignalR.Providers
{
    public class NewsContext : DbContext
    {
        public NewsContext(DbContextOptions<NewsContext> options) :base(options)
        { }

        public DbSet<NewsItemEntity> NewsItemEntities { get; set; }

        public DbSet<NewsGroup> NewsGroups { get; set; }
    }
}