using System.Text.Json.Serialization;
using Api.Core.Models;
using Api.Enums;

namespace Api.Models;

public class Delivery : BaseEntity
{
    public string DeliveryNumber { get; set; } = string.Empty;
    public int? SaleId { get; set; }
    public int CustomerId { get; set; }
    public int DriverId { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public DeliveryStatus Status { get; set; } = DeliveryStatus.Scheduled;
    public Priority Priority { get; set; } = Priority.Normal;
    public DateTime ScheduledDate { get; set; }
    public DateTime? DeliveredDate { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Sale? Sale { get; set; }
    public virtual Customer Customer { get; set; } = null!;
    public virtual Driver Driver { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<DeliveryItem> Items { get; set; } = new List<DeliveryItem>();
}
