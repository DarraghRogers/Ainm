using Microsoft.AspNetCore.Mvc;
using Ainm.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Ainm.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PartnerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;

        public PartnerController(AppDbContext context, IEmailSender emailSender, IConfiguration configuration)
        {
            _context = context;
            _emailSender = emailSender;
            _configuration = configuration;
        }

        // POST: api/partner/invite
        [HttpPost("invite")]
        public async Task<IActionResult> InvitePartner([FromBody] InviteRequest request)
        {
            var existingInvite = await _context.PartnerInvite
                .FirstOrDefaultAsync(i => i.InviteeEmail == request.Email && !i.Accepted);

            if (existingInvite != null)
            {
                // Return existing link
                return Ok(new { link = GenerateInviteLink(existingInvite.InviteCode), existing = true });
            }

            // Create new invite
            var inviteCode = Guid.NewGuid().ToString();
            var invite = new PartnerInvite
            {
                InviteeEmail = request.Email,
                InviteCode = inviteCode,
                Accepted = false,
                InviterUserId = ControllerHelpers.GetUserIdFromClaims(User)
            };
            _context.PartnerInvite.Add(invite);
            await _context.SaveChangesAsync();

            // Send email if needed...
            var link = GenerateInviteLink(inviteCode);

            if (!string.IsNullOrEmpty(request.Email))
            {
                await _emailSender.SendEmailAsync(
                    request.Email,
                    "You've been invited to swipe as a partner!",
                    $"Click here to join: {link}"
                );
            }

            return Ok(new { link = GenerateInviteLink(inviteCode), existing = false });
        }

        // POST: api/partner/link
        [HttpPost("link")]
        public async Task<IActionResult> LinkPartner([FromBody] LinkPartnerRequest request)
        {
            var inviterId = ControllerHelpers.GetUserIdFromClaims(User);
            var invite = await _context.PartnerInvite
                .FirstOrDefaultAsync(i => i.InviteCode == request.InviteCode && !i.Accepted);

            if (invite == null)
                return BadRequest("Invalid or expired invite code.");

            // Link users as partners (e.g., add to Partner table)
            var partnership = new Partnership
            {
                UserAId = invite.InviterUserId,
                UserBId = inviterId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Partnerships.Add(partnership);

            // Update PartnerId for both users
            var inviter = await _context.Users.FindAsync(invite.InviterUserId);
            var invitee = await _context.Users.FindAsync(inviterId);
            if (inviter != null && invitee != null)
            {
                inviter.PartnerId = invitee.Id;
                invitee.PartnerId = inviter.Id;
            }

            invite.Accepted = true;
            await _context.SaveChangesAsync();

            return Ok("Partner linked!");
        }

        private string GenerateInviteLink(string inviteCode)
        {
            var apiUrl = Environment.GetEnvironmentVariable("REACT_APP_API_URL");
            return $"{apiUrl}/invite/{inviteCode}";
        }
    }

    public class InviteRequest
    {
        public string Email { get; set; }
    }

    public class LinkPartnerRequest
    {
        public string InviteCode { get; set; }
    }
}