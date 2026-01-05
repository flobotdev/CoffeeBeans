using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AllTheBeans.Models
{

    [Table("beans")]
    public class Bean
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("index")]
        public int Index { get; set; }

        [Column("cost")]
        [Required]
        public decimal Cost { get; set; }

        [Column("image")]
        [Required]
        [MaxLength(500)]
        public string Image { get; set; } = string.Empty;

        [Column("colour")]
        [Required]
        [MaxLength(100)]
        public string Colour { get; set; } = string.Empty;

        [Column("name")]
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Column("country")]
        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        // Navigation property
        public BeanOfTheDay? BeanOfTheDay { get; set; }
    }

}
