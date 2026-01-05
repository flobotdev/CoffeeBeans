using AllTheBeans.Data;
using AllTheBeans.Models;
using AllTheBeans.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AllTheBeans.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeansController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IBeanOfTheDayService _beanOfTheDayService;
        private readonly ILogger<BeansController> _logger;

        public BeansController(
            AppDbContext context,
            IBeanOfTheDayService beanOfTheDayService,
            ILogger<BeansController> logger)
        {
            _context = context;
            _beanOfTheDayService = beanOfTheDayService;
            _logger = logger;
        }

        // GET: api/beans/botd
        [HttpGet("botd")]
        public async Task<ActionResult<BeansView>> GetBeanOfTheDay()
        {
            try
            {
                var bean = await _beanOfTheDayService.GetBeanOfTheDayAsync();

                if (bean == null)
                {
                    return NotFound(new { error = "Bean of the day not found" });
                }

                var beanDto = new BeansView
                {
                    Id = bean.Id,
                    Index = bean.Index,
                    IsBOTD = true,
                    Cost = bean.Cost,
                    Image = bean.Image,
                    Colour = bean.Colour,
                    Name = bean.Name,
                    Description = bean.Description,
                    Country = bean.Country
                };

                return Ok(beanDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bean of the day");
                return StatusCode(500, new { error = "Failed to fetch bean of the day" });
            }
        }

        // GET: api/beans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BeansView>>> GetBeans()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);

                var beans = await _context.Beans
                    .Select(b => new BeansView
                    {
                        Id = b.Id,
                        Index = b.Index,
                        IsBOTD = b.BeanOfTheDay != null && b.BeanOfTheDay.SelectedDate == today,
                        Cost = b.Cost,
                        Image = b.Image,
                        Colour = b.Colour,
                        Name = b.Name,
                        Description = b.Description,
                        Country = b.Country
                    })
                    .OrderBy(b => b.Index)
                    .ToListAsync();

                return Ok(beans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching beans");
                return StatusCode(500, new { error = "Failed to fetch beans" });
            }
        }

        // GET: api/beans/search?q=searchTerm
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<BeansView>>> SearchBeans([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest(new { error = "Search query parameter 'q' is required" });
                }

                var today = DateOnly.FromDateTime(DateTime.Today);
                var searchTerm = q.ToLower();

                var beans = await _context.Beans
                    .Where(b =>
                        b.Name.ToLower().Contains(searchTerm) ||
                        b.Country.ToLower().Contains(searchTerm) ||
                        b.Colour.ToLower().Contains(searchTerm) ||
                        b.Description.ToLower().Contains(searchTerm))
                    .Select(b => new BeansView
                    {
                        Id = b.Id,
                        Index = b.Index,
                        IsBOTD = b.BeanOfTheDay != null && b.BeanOfTheDay.SelectedDate == today,
                        Cost = b.Cost,
                        Image = b.Image,
                        Colour = b.Colour,
                        Name = b.Name,
                        Description = b.Description,
                        Country = b.Country
                    })
                    .OrderBy(b => b.Index)
                    .ToListAsync();

                return Ok(beans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching beans");
                return StatusCode(500, new { error = "Search failed" });
            }
        }

        // GET: api/beans/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BeansView>> GetBean(Guid id)
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);

                var bean = await _context.Beans
                    .Where(b => b.Id == id)
                    .Select(b => new BeansView
                    {
                        Id = b.Id,
                        Index = b.Index,
                        IsBOTD = b.BeanOfTheDay != null && b.BeanOfTheDay.SelectedDate == today,
                        Cost = b.Cost,
                        Image = b.Image,
                        Colour = b.Colour,
                        Name = b.Name,
                        Description = b.Description,
                        Country = b.Country
                    })
                    .FirstOrDefaultAsync();

                if (bean == null)
                {
                    return NotFound(new { error = "Bean not found" });
                }

                return Ok(bean);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching bean {BeanId}", id);
                return StatusCode(500, new { error = "Failed to fetch bean" });
            }
        }

        // POST: api/beans
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BeansView>> CreateBean([FromBody] BeansView beanDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Get the next index
                var maxIndex = await _context.Beans.MaxAsync(b => (int?)b.Index) ?? -1;
                var nextIndex = maxIndex + 1;

                var bean = new Bean
                {
                    Id = Guid.NewGuid(),
                    Index = nextIndex,
                    Cost = beanDto.Cost,
                    Image = beanDto.Image,
                    Colour = beanDto.Colour,
                    Name = beanDto.Name,
                    Description = beanDto.Description,
                    Country = beanDto.Country,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Beans.Add(bean);
                await _context.SaveChangesAsync();

                var today = DateOnly.FromDateTime(DateTime.Today);
                var result = new BeansView
                {
                    Id = bean.Id,
                    Index = bean.Index,
                    IsBOTD = false,
                    Cost = bean.Cost,
                    Image = bean.Image,
                    Colour = bean.Colour,
                    Name = bean.Name,
                    Description = bean.Description,
                    Country = bean.Country
                };

                return CreatedAtAction(nameof(GetBean), new { id = bean.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating bean");
                return StatusCode(500, new { error = "Failed to add bean" });
            }
        }

        // PUT: api/beans/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<BeansView>> UpdateBean(Guid id, [FromBody] BeansView beanDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var bean = await _context.Beans.FindAsync(id);

                if (bean == null)
                {
                    return NotFound(new { error = "Bean not found" });
                }

                bean.Cost = beanDto.Cost;
                bean.Image = beanDto.Image;
                bean.Colour = beanDto.Colour;
                bean.Name = beanDto.Name;
                bean.Description = beanDto.Description;
                bean.Country = beanDto.Country;
                bean.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var today = DateOnly.FromDateTime(DateTime.Today);
                var isBotd = await _context.BeanOfTheDay
                    .AnyAsync(b => b.BeanId == id && b.SelectedDate == today);

                var result = new BeansView
                {
                    Id = bean.Id,
                    Index = bean.Index,
                    IsBOTD = isBotd,
                    Cost = bean.Cost,
                    Image = bean.Image,
                    Colour = bean.Colour,
                    Name = bean.Name,
                    Description = bean.Description,
                    Country = bean.Country
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating bean {BeanId}", id);
                return StatusCode(500, new { error = "Failed to update bean" });
            }
        }

        // DELETE: api/beans/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteBean(Guid id)
        {
            try
            {
                var bean = await _context.Beans.FindAsync(id);

                if (bean == null)
                {
                    return NotFound(new { error = "Bean not found" });
                }

                _context.Beans.Remove(bean);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Bean deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting bean {BeanId}", id);
                return StatusCode(500, new { error = "Failed to delete bean" });
            }
        }
    }

}
