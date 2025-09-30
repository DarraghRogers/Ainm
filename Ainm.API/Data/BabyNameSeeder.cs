using Ainm.API.Models;
using System.Collections.Generic;
using System.Text.Json;

namespace Ainm.API.Data
{
    public static class BabyNameSeeder
    {

        public static void SeedAllBatches(AppDbContext context)
        {
            var batchFiles = Directory.GetFiles("Data", "irish_babynames.json");
            foreach (var file in batchFiles)
            {
                var json = File.ReadAllText(file);
                var babyNames = JsonSerializer.Deserialize<List<BabyName>>(json);

                foreach (var name in babyNames)
                {
                    if (!context.BabyNames.Any(b => b.Name == name.Name && b.Gender == name.Gender))
                    {
                        context.BabyNames.Add(name);
                    }
                }
            }
            context.SaveChanges();
        }

        #region Seed Data
        public static List<BabyName> GetSeedNames()
        {
            return new List<BabyName>
            {
                new BabyName {
                    Id = 1,
                    Name = "Aifric",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "",
                    Meaning = "",
                    Pronunciation = "",               // uncertain / rare; left blank
                    Notes = "",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = ""
                },
                new BabyName {
                    Id = 2,
                    Name = "Ailbhe",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "An Old Irish name used historically for both men and women. It has been borne by early saints and literary figures.",
                    Meaning = "",
                    Pronunciation = "AL-və",          // common anglicisation: Alvy/Elva
                    Notes = "Historically used for males and females; anglicised forms include Alvy and Elva.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Alvy,Elva (anglicisations)"
                },
                new BabyName {
                    Id = 3,
                    Name = "Áine",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "Associated in Irish tradition with Áine, a Celtic goddess of summer, wealth and sovereignty. Also used as a woman's name.",
                    Meaning = "",
                    Pronunciation = "AWN-ye",         // common pronunciation: AWN-ya / AWN-ye
                    Notes = "Mythological associations: Áine is often described as a goddess or figure of Irish folklore.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Anna,Anne"
                },
                new BabyName {
                    Id = 4,
                    Name = "Aisling",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "Literally means \"dream\" or \"vision\" in Irish; also the name of an 18th–19th century Irish poetic genre (the aisling) in which Ireland appears as a woman in a vision.",
                    Meaning = "",
                    Pronunciation = "ASH-ling",
                    Notes = "Used both as a given name and as the name of a poetic genre in Irish literature.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Ashling,Ashlyn (anglicisations)"
                },
                new BabyName {
                    Id = 5,
                    Name = "Aodhnait",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "A feminine form related to Aodhán/Aodh; historically a diminutive form.",
                    Meaning = "",
                    Pronunciation = "",               // uncommon variant — pronunciation varies
                    Notes = "Feminine form of Aodhán; rare in modern use.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Enat,Ena (anglicisation)"
                },
                new BabyName {
                    Id = 6,
                    Name = "Aoibheann",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "",
                    Meaning = "",
                    Pronunciation = "EE-van",          // common modern pronunciation
                    Notes = "A beautiful-sounding Irish feminine name; anglicised as Eavan in some sources.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Eavan (anglicisation)"
                },
                new BabyName {
                    Id = 7,
                    Name = "Aoife",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "A very well-known Irish feminine name. In legend Aoife is the name of several women including warrior figures; the name is widely used in Ireland.",
                    Meaning = "",
                    Pronunciation = "EE-fa",
                    Notes = "Widely used in Ireland and Irish diaspora; features in several Irish legends as a warrior or notable figure.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Eva (English equivalent)"
                },
                new BabyName {
                    Id = 8,
                    Name = "Barrdhubh",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "",
                    Meaning = "",
                    Pronunciation = "",               // uncommon / archaic; left blank
                    Notes = "",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Barduv (anglicisation)"
                },
                new BabyName {
                    Id = 9,
                    Name = "Béibhinn",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "A traditional Irish feminine name often associated with beauty and sweetness in meaning and usage.",
                    Meaning = "",
                    Pronunciation = "BAY-vin",        // common anglicised pronunciation
                    Notes = "Often anglicised as Bevin; appears in Irish mythology/legend in variants.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Bevin,Vivian (equivalent)"
                },
                new BabyName {
                    Id = 10,
                    Name = "Bláithín Bláthnaid",
                    Gender = "Male",
                    Origin = "Irish",
                    Description = "Bláithín (diminutive) and Bláthnaid are names related to the Irish word for 'flower'; Bláithín means 'little flower'.",
                    Meaning = "",
                    Pronunciation = "BLAW-heen",      // Bláithín common pronunciation
                    Notes = "Floral-themed Irish feminine names; anglicisations/equivalents include Flora, Florence.",
                    VariantsSerialized = "",
                    AnglicizedNamesSerialized = "Blanid,Flora,Florence"
                }
            };
        }

        #endregion
    }
}