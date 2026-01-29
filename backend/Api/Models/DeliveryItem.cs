using System.Text.Json.Serialization;

namespace Api.Models
{
    public class DeliveryItem
    {
        public int Id { get; set; }
        public int DeliveryId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public virtual Delivery Delivery { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
