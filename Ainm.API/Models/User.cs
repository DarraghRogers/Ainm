using System.ComponentModel.DataAnnotations;

namespace Ainm.API.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }

        // Linking to another user
        public int? PartnerId { get; set; }
        public User? Partner { get; set; }
    }
}