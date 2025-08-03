using Ainm.API.Models;
using System.Collections.Generic;

namespace Ainm.API.Data
{
    public static class BabyNameSeeder
    {
        public static List<BabyName> GetSeedNames()
        {
            return new List<BabyName>
            {
                new BabyName { Name = "Ava", Gender = "Female", Origin = "Hebrew", Description = "Popular name meaning 'life'", Meaning = "Life" },
                new BabyName { Name = "Liam", Gender = "Male", Origin = "Irish", Description = "Short form of William", Meaning = "Strong-willed warrior" },
                new BabyName { Name = "Sophia", Gender = "Female", Origin = "Greek", Description = "Means 'wisdom'", Meaning = "Wisdom" },
                new BabyName { Name = "Noah", Gender = "Male", Origin = "Hebrew", Description = "Biblical name meaning 'rest, comfort'", Meaning = "Rest, comfort" },
                new BabyName { Name = "Oliver", Gender = "Male", Origin = "Latin", Description = "Means 'olive tree'", Meaning = "Olive tree" },
                new BabyName { Name = "Emma", Gender = "Female", Origin = "German", Description = "Means 'whole' or 'universal'", Meaning = "Whole, universal" }
                // Add more names as needed
            };
        }
    }
}