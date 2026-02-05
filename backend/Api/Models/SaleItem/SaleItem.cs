using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class SaleItem : BaseEntity
{
    public int SaleId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal? Discount { get; set; }

    // Navigation properties
    [JsonIgnore]
    public virtual Sale Sale { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
