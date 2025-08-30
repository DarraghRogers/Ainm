using Microsoft.AspNetCore.Mvc;
using Ainm.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Ainm.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MatchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMatches(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.PartnerId == null) return BadRequest("No partner linked.");

            var matches = await _context.Matches
                .Where(m => (m.UserAId == userId && m.UserBId == user.PartnerId) ||
                            (m.UserAId == user.PartnerId && m.UserBId == userId))
                .Select(m => m.BabyNameId)
                .ToListAsync();

            var names = await _context.BabyNames
                .Where(b => matches.Contains(b.Id))
                .ToListAsync();

            return Ok(names);
        }

        [HttpDelete("{userId}/{babyNameId}")]
        public async Task<IActionResult> RemoveMatch(int userId, int babyNameId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.PartnerId == null) return BadRequest("No partner linked.");

            var match = await _context.Matches.FirstOrDefaultAsync(m =>
                ((m.UserAId == userId && m.UserBId == user.PartnerId) ||
                 (m.UserAId == user.PartnerId && m.UserBId == userId)) &&
                m.BabyNameId == babyNameId);

            if (match == null) return NotFound();

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}