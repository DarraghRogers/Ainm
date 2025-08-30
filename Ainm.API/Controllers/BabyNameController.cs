using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ainm.API.Data; // Replace with your actual namespace
using Ainm.API.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class BabyNameController : ControllerBase
{
    private readonly AppDbContext _context;

    public BabyNameController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BabyName>>> GetBabyNames()
    {
        return await _context.BabyNames.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BabyName>> GetBabyName(int id)
    {
        var babyName = await _context.BabyNames.FindAsync(id);

        if (babyName == null)
            return NotFound();

        return babyName;
    }

    [HttpPost]
    public async Task<ActionResult<BabyName>> PostBabyName(BabyName babyName)
    {
        _context.BabyNames.Add(babyName);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBabyName), new { id = babyName.Id }, babyName);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBabyName(int id, BabyName babyName)
    {
        if (id != babyName.Id)
            return BadRequest();

        _context.Entry(babyName).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.BabyNames.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBabyName(int id)
    {
        var babyName = await _context.BabyNames.FindAsync(id);

        if (babyName == null)
            return NotFound();

        _context.BabyNames.Remove(babyName);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
