using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class DeliveryItem : BaseEntity
{
    public int DeliveryId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }

    // Navigation properties
    [JsonIgnore]
    public virtual Delivery Delivery { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
