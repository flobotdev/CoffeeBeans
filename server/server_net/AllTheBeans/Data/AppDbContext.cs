using AllTheBeans.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace AllTheBeans.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Bean> Beans { get; set; }
    public DbSet<BeanOfTheDay> BeanOfTheDay { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Bean entity
        modelBuilder.Entity<Bean>(entity =>
        {
            entity.ToTable("beans");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Cost).HasColumnType("numeric(10,2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasIndex(e => e.Index).IsUnique();
        });

        // Configure BeanOfTheDay entity
        modelBuilder.Entity<BeanOfTheDay>(entity =>
        {
            entity.ToTable("bean_of_the_day");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasIndex(e => e.SelectedDate).IsUnique();

            entity.HasOne(e => e.Bean)
                  .WithOne(b => b.BeanOfTheDay)
                  .HasForeignKey<BeanOfTheDay>(e => e.BeanId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
