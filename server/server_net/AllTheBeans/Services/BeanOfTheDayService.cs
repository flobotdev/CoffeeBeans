using AllTheBeans.Data;
using AllTheBeans.Models;
using Microsoft.EntityFrameworkCore;

namespace AllTheBeans.Services
{
    public class BeanOfTheDayService : IBeanOfTheDayService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BeanOfTheDayService> _logger;

        public BeanOfTheDayService(AppDbContext context, ILogger<BeanOfTheDayService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Bean?> GetBeanOfTheDayAsync()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);

                // Check if there's a bean of the day for today
                var beanOfTheDay = await _context.BeanOfTheDay
                    .Include(b => b.Bean)
                    .FirstOrDefaultAsync(b => b.SelectedDate == today);

                if (beanOfTheDay != null)
                {
                    return beanOfTheDay.Bean;
                }

                // If no bean of the day exists for today, select a random one
                var beansCount = await _context.Beans.CountAsync();

                if (beansCount == 0)
                {
                    _logger.LogWarning("No beans available in database");
                    return null;
                }

                var random = new Random();
                var randomBean = await _context.Beans
                    .OrderBy(b => b.Index)
                    .Skip(random.Next(beansCount))
                    .FirstOrDefaultAsync();

                if (randomBean == null)
                {
                    return null;
                }

                // Set this bean as bean of the day
                var newBeanOfTheDay = new BeanOfTheDay
                {
                    BeanId = randomBean.Id,
                    SelectedDate = today,
                    CreatedAt = DateTime.UtcNow
                };

                _context.BeanOfTheDay.Add(newBeanOfTheDay);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Set new bean of the day: {BeanName} (ID: {BeanId})",
                    randomBean.Name, randomBean.Id);

                return randomBean;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bean of the day");
                throw;
            }
        }

        public async Task<Bean> SetBeanOfTheDayAsync(Guid beanId)
        {
            try
            {
                var bean = await _context.Beans.FindAsync(beanId);

                if (bean == null)
                {
                    throw new ArgumentException($"Bean with ID {beanId} not found");
                }

                var today = DateOnly.FromDateTime(DateTime.Today);

                // Check if there's already a bean of the day for today
                var existingBotd = await _context.BeanOfTheDay
                    .FirstOrDefaultAsync(b => b.SelectedDate == today);

                if (existingBotd != null)
                {
                    // Update existing bean of the day
                    existingBotd.BeanId = beanId;
                }
                else
                {
                    // Create new bean of the day
                    var newBotd = new BeanOfTheDay
                    {
                        BeanId = beanId,
                        SelectedDate = today,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.BeanOfTheDay.Add(newBotd);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Bean of the day set to: {BeanName} (ID: {BeanId})",
                    bean.Name, bean.Id);

                return bean;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting bean of the day");
                throw;
            }
        }
    }
}
