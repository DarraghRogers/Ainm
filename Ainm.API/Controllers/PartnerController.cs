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
    private readonly IEmailSender _emailSender;

    public PartnerController(AppDbContext context, IEmailSender emailSender)
    {
        _context = context;
        _emailSender = emailSender;
    }

    // POST: api/partner/invite
    [HttpPost("invite")]
    public async Task<IActionResult> InvitePartner([FromBody] InvitePartnerRequest request)
    {
        
        var inviterId = ControllerHelpers.GetUserIdFromClaims(User);
        Console.WriteLine($"Inviter ID: {inviterId}");
        var inviteCode = Guid.NewGuid().ToString().Substring(0, 8);

        var invite = new PartnerInvite
        {
            InviterUserId = inviterId,
            InviteeEmail = request.Email,
            InviteCode = inviteCode,
            CreatedAt = DateTime.UtcNow,
            Accepted = false
        };

        _context.PartnerInvite.Add(invite);
        await _context.SaveChangesAsync();

        var link = $"http://localhost:3000/invite/{inviteCode}";

        if (!string.IsNullOrEmpty(request.Email))
        {
            await _emailSender.SendEmailAsync(
                request.Email,
                "You've been invited to swipe as a partner!",
                $"Click here to join: {link}"
            );
        }

        return Ok(new { link });
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

        invite.Accepted = true;
        await _context.SaveChangesAsync();

        return Ok("Partner linked!");
    }
}

public class InvitePartnerRequest
{
    public string Email { get; set; }
}

public class LinkPartnerRequest
{
    public string InviteCode { get; set; }
}
}