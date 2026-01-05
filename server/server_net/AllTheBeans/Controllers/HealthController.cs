using AllTheBeans.Data;
using Microsoft.AspNetCore.Mvc;

namespace AllTheBeans.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<HealthController> _logger;

        public HealthController(AppDbContext context, ILogger<HealthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/health
        [HttpGet]
        public async Task<ActionResult> GetHealth()
        {
            try
            {
                // Test database connection
                await _context.Database.CanConnectAsync();

                return Ok(new
                {
                    status = "OK",
                    message = "All The Beans API and database are running"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection failed");
                return StatusCode(500, new
                {
                    status = "ERROR",
                    message = "Database connection failed",
                    error = ex.Message
                });
            }
        }
    }

}
