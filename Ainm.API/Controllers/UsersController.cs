using Microsoft.AspNetCore.Mvc;
using Ainm.API.Data;
using Ainm.API.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net; // BCrypt.Net-Next
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Ainm.API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailSender _emailSender;
        public UsersController(AppDbContext context, IConfiguration config, IEmailSender emailSender)
        {
            _context = context;
            _config = config;
            _emailSender = emailSender;
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            if (!int.TryParse(userIdStr, out int userId))
                return BadRequest("Invalid user ID.");

            var user = _context.Users.Find(userId);
            if (user == null) return NotFound();

            return Ok(new { user.Id, user.Username, user.Email /* other fields */ });
        }
        // Registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            Console.WriteLine($"Registering user: {req.Username}, {req.Email}");
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
            Console.WriteLine($"Logging in user: {req.Email}");
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            var token = GenerateJwtToken(user);
            Console.WriteLine($"Generated JWT for user {user.Username}: {token}");
            var env = _config["ASPNETCORE_ENVIRONMENT"] ?? Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            bool isProd = string.Equals(env, "Production", StringComparison.OrdinalIgnoreCase);

            CookieOptions cookieOptions;
            if (isProd)
            {
                cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(5)
                };
            }
            else
            {
                cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddDays(5)
                };
            }
            // Response.Cookies.Append("jwt", token, new CookieOptions
            // {
                
            //     HttpOnly = true,
            //     Secure = true, // ONLY use true for HTTPS
            //     SameSite = SameSiteMode.None, // Lax is safest for localhost
            //     Expires = DateTimeOffset.UtcNow.AddDays(5)
            // });

            return Ok(new { token });
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            Console.WriteLine($"Fetching user with ID {id}: {user?.Username ?? "Not found"}");
            if (user == null)
                return NotFound();

            return Ok(new { user.Id, user.Username, user.Email });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Overwrite cookie to expire immediately
            Response.Cookies.Append("jwt", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(-1)
            });
            return Ok(new { message = "Logged out" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            // Always return generic message for security
            if (user == null)
                return Ok(new { message = "If that email exists, a reset link has been sent." });

            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            user.PasswordResetToken = token;
            user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:3000";
            var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}";
            Console.WriteLine($"Sending password reset email to {user.Email} with link: {resetLink}");
            var subject = "Reset your Ainm password";
            var htmlContent = $@"
                <h2>Reset Your Password</h2>
                <p>Click the link below to reset your password:</p>
                <a href='{resetLink}'>Reset Password</a>
                <p>If you did not request this, you can ignore this email.</p>
            ";

            await _emailSender.SendEmailAsync(user.Email, subject, htmlContent);

            return Ok(new { message = "If that email exists, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.PasswordResetToken == req.Token &&
                u.PasswordResetTokenExpires > DateTime.UtcNow);

            if (user == null)
                return BadRequest("Invalid or expired reset token.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password has been reset successfully." });
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

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        public class ResetPasswordRequest
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("username", user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}