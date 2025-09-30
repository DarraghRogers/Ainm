namespace Ainm.API.Models
{
    public class BabyName
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Meaning { get; set; } = string.Empty;
        public string Pronunciation { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;

        // Serialized for EF Core seeding
        public string VariantsSerialized { get; set; } = string.Empty;

        // Not mapped to DB, used in code
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public List<string> Variants
        {
            get => string.IsNullOrEmpty(VariantsSerialized)
                ? new List<string>()
                : new List<string>(VariantsSerialized.Split(','));
            set => VariantsSerialized = value != null ? string.Join(",", value) : string.Empty;
        }

        public string AnglicizedNamesSerialized { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public List<string> AnglicizedNames
        {
            get => string.IsNullOrEmpty(AnglicizedNamesSerialized)
                ? new List<string>()
                : new List<string>(AnglicizedNamesSerialized.Split(','));
            set => AnglicizedNamesSerialized = value != null ? string.Join(",", value) : string.Empty;
        }
    }
}