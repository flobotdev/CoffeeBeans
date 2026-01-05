using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AllTheBeans.Models
{
    [Table("bean_of_the_day")]
    public class BeanOfTheDay
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("bean_id")]
        [Required]
        public Guid BeanId { get; set; }

        [Column("selected_date")]
        [Required]
        public DateOnly SelectedDate { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // Navigation property
        [ForeignKey("BeanId")]
        public Bean Bean { get; set; } = null!;
    }
}
