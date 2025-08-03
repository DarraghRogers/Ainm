using Microsoft.AspNetCore.Mvc;
using Ainm.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Ainm.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public string GetTest(int userId)
        {
            return $"Hello World! The input value is: {userId}";
        }
    }
}