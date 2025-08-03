using Microsoft.AspNetCore.Mvc;
using Ainm.API.Data;
using Ainm.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Ainm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SwipeController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SwipeController(AppDbContext context)
        {
            _context = context;
        }

        // User swipes on a name
        [HttpPost]
        public async Task<IActionResult> Swipe([FromBody] SwipeRequest req)
        {
            var user = await _context.Users.FindAsync(req.UserId);
            if (user == null) return BadRequest("User not found.");

            // Record the swipe
            var swipe = await _context.Swipes
                .FirstOrDefaultAsync(s => s.UserId == req.UserId && s.BabyNameId == req.BabyNameId);
            if (swipe == null)
            {
                swipe = new Swipe
                {
                    UserId = req.UserId,
                    BabyNameId = req.BabyNameId,
                    Liked = req.Liked
                };
                _context.Swipes.Add(swipe);
            }
            else
            {
                swipe.Liked = req.Liked;
            }
            await _context.SaveChangesAsync();

            // Matching logic
            if (req.Liked && user.PartnerId != null)
            {
                var partnerSwipe = await _context.Swipes
                    .FirstOrDefaultAsync(s => s.UserId == user.PartnerId && s.BabyNameId == req.BabyNameId && s.Liked);
                if (partnerSwipe != null)
                {
                    // Match found
                    var matchExists = await _context.Matches
                        .AnyAsync(m => m.UserAId == user.Id && m.UserBId == user.PartnerId && m.BabyNameId == req.BabyNameId);
                    if (!matchExists)
                    {
                        _context.Matches.Add(new Match
                        {
                            UserAId = user.Id,
                            UserBId = (int)user.PartnerId,
                            BabyNameId = req.BabyNameId
                        });
                        await _context.SaveChangesAsync();
                        // Notify both users here (demo: just return message)
                        return Ok(new { matched = true });
                    }
                }
            }

            return Ok(new { matched = false });
        }

        public class SwipeRequest
        {
            public int UserId { get; set; }
            public int BabyNameId { get; set; }
            public bool Liked { get; set; }
        }
    }
}