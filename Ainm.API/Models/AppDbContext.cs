using Microsoft.EntityFrameworkCore;
using Ainm.API.Models;

namespace Ainm.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<BabyName> BabyNames { get; set; }
        public DbSet<Swipe> Swipes { get; set; }
        public DbSet<Match> Matches { get; set; }
    }
}