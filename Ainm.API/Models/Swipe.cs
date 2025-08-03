namespace Ainm.API.Models
{
    public class Swipe
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BabyNameId { get; set; }
        public bool Liked { get; set; }
    }
}