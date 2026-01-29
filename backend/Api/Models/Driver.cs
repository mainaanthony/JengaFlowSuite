using System.Text.Json.Serialization;

namespace Api.Models
{
    public class Driver
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? LicenseNumber { get; set; }
        public string Vehicle { get; set; } = string.Empty;
        public string? VehicleRegistration { get; set; }
        public string Status { get; set; } = "Available"; // Available, On Delivery, Off Duty
        public decimal Rating { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
    }
}
