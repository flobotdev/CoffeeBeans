using AllTheBeans.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AllTheBeans.Data;

public static class DBInitializer
{
    public static async Task InitializeAsync(AppDbContext context, ILogger logger)
    {
        try
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if beans already exist
            if (await context.Beans.AnyAsync())
            {
                logger.LogInformation("Database already contains beans. Skipping initialization.");
                return;
            }

            // Load beans from JSON file
            var jsonPath = Path.Combine(AppContext.BaseDirectory, "Init", "beans.json");

            if (!File.Exists(jsonPath))
            {
                logger.LogWarning("beans.json not found at {Path}. Skipping data initialization.", jsonPath);
                return;
            }

            var jsonContent = await File.ReadAllTextAsync(jsonPath);
            var beansData = JsonSerializer.Deserialize<List<BeanJsonData>>(jsonContent);

            if (beansData == null || beansData.Count == 0)
            {
                logger.LogWarning("No beans found in beans.json");
                return;
            }

            // Insert beans
            var beans = new List<Bean>();
            for (int i = 0; i < beansData.Count; i++)
            {
                var beanData = beansData[i];
                var beanToAdd = new Bean
                {
                    Id = Guid.NewGuid(),
                    Index = i,
                    Cost = beanData.Cost,
                    Image = beanData.Image,
                    Colour = beanData.Colour,
                    Name = beanData.Name,
                    Description = beanData.Description,
                    Country = beanData.Country,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                beans.Add(beanToAdd);
            }

            await context.Beans.AddRangeAsync(beans);
            await context.SaveChangesAsync();

            logger.LogInformation("Successfully initialized database with {Count} beans", beans.Count);

            // Set a random bean as bean of the day
            var random = new Random();
            var randomBean = beans[random.Next(beans.Count)];

            var beanOfTheDay = new BeanOfTheDay
            {
                BeanId = randomBean.Id,
                SelectedDate = DateOnly.FromDateTime(DateTime.Today),
                CreatedAt = DateTime.UtcNow
            };

            await context.BeanOfTheDay.AddAsync(beanOfTheDay);
            await context.SaveChangesAsync();

            logger.LogInformation("Set bean of the day: {BeanName}", randomBean.Name);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error initializing database");
            throw;
        }
    }

    private class BeanJsonData
    {
        public decimal Cost { get; set; }
        public string Image { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }
}
