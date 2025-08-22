using Microsoft.EntityFrameworkCore;
using Ainm.API.Models;

namespace Ainm.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<BabyName> BabyNames { get; set; }
        public DbSet<Swipe> Swipes { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<PartnerInvite> PartnerInvite { get; set; }
        public DbSet<Partnership> Partnerships { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<BabyName>().HasData(
                new BabyName { Id = 1, Name = "Ava", Gender = "F", Origin = "Hebrew", Meaning = "Life", Description = "Popular girl's name." },
                new BabyName { Id = 2, Name = "Liam", Gender = "M", Origin = "Irish", Meaning = "Strong-willed warrior", Description = "Popular boy's name." },
                new BabyName { Id = 3, Name = "Noah", Gender = "M", Origin = "Hebrew", Meaning = "Rest, comfort", Description = "Classic boy's name." },
                new BabyName { Id = 4, Name = "Emma", Gender = "F", Origin = "German", Meaning = "Whole or universal", Description = "Timeless girl's name." },
                new BabyName { Id = 5, Name = "Oliver", Gender = "M", Origin = "Latin", Meaning = "Olive tree", Description = "Nature-inspired boy's name." },
                new BabyName { Id = 6, Name = "Sophia", Gender = "F", Origin = "Greek", Meaning = "Wisdom", Description = "Elegant girl's name." },
                new BabyName { Id = 7, Name = "Elijah", Gender = "M", Origin = "Hebrew", Meaning = "My God is Yahweh", Description = "Biblical boy's name." },
                new BabyName { Id = 8, Name = "Mia", Gender = "F", Origin = "Italian", Meaning = "Mine", Description = "Short and sweet girl's name." },
                new BabyName { Id = 9, Name = "James", Gender = "M", Origin = "Hebrew", Meaning = "Supplanter", Description = "Classic and strong boy's name." },
                new BabyName { Id = 10, Name = "Isabella", Gender = "F", Origin = "Hebrew", Meaning = "God is my oath", Description = "Beautiful girl's name." }
            );
        }
    }
}