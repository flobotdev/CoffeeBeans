namespace AllTheBeans.Models
{
    public class BeansView
    {
        public Guid Id { get; set; }
        public int Index { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("isBOTD")]
        public bool IsBOTD { get; set; }
        public decimal Cost { get; set; }
        public string Image { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }
}
