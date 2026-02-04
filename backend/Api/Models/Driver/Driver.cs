using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models.Driver
{
    public class Driver : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? LicenseNumber { get; set; }
        public string Vehicle { get; set; } = string.Empty;
        public string? VehicleRegistration { get; set; }
        public string Status { get; set; } = "Available"; // Available, On Delivery, Off Duty
        public decimal Rating { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<Delivery.Delivery> Deliveries { get; set; } = new List<Delivery.Delivery>();
    }
}
