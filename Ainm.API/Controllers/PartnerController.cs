using Microsoft.AspNetCore.Mvc;
using Ainm.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Ainm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PartnerController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PartnerController(AppDbContext context)
        {
            _context = context;
        }

        // Link users via email or code
        [HttpPost("link")]
        public async Task<IActionResult> LinkPartner([FromBody] LinkRequest req)
        {
            var user = await _context.Users.FindAsync(req.UserId);
            var partner = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.PartnerEmail);
            if (user == null || partner == null) return BadRequest("User or partner not found.");

            user.PartnerId = partner.Id;
            partner.PartnerId = user.Id;
            await _context.SaveChangesAsync();
            return Ok("Linked successfully.");
        }

        // Unlink partner
        [HttpPost("unlink")]
        public async Task<IActionResult> UnlinkPartner([FromBody] int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.PartnerId == null) return BadRequest("No partner to unlink.");

            var partner = await _context.Users.FindAsync(user.PartnerId);
            user.PartnerId = null;
            if (partner != null && partner.PartnerId == user.Id)
                partner.PartnerId = null;
            await _context.SaveChangesAsync();
            return Ok("Unlinked successfully.");
        }

        public class LinkRequest
        {
            public int UserId { get; set; }
            public string PartnerEmail { get; set; }
        }
    }
}