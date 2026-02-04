using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models.DeliveryItem
{
    public class DeliveryItem : BaseEntity
    {
        public int DeliveryId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual Delivery.Delivery Delivery { get; set; } = null!;
        public virtual Product.Product Product { get; set; } = null!;
    }
}
