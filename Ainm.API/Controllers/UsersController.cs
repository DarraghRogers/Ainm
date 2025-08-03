using Microsoft.AspNetCore.Mvc;
using Ainm.API.Data;
using Ainm.API.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net; // BCrypt.Net-Next

namespace Ainm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // Registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (await _context.Users.AnyAsync(u => u.Email == req.Email))
                return BadRequest("Email already in use.");

            var user = new User
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { user.Id, user.Username, user.Email });
        }

        // Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            // Here, generate JWT token (for demo, return user info)
            return Ok(new { user.Id, user.Username, user.Email });
        }

        public class RegisterRequest
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}