using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class StockTransferItem : BaseEntity
{
    public int StockTransferId { get; set; }
    public int ProductId { get; set; }
    public int QuantityRequested { get; set; }
    public int? QuantityTransferred { get; set; }

    // Navigation properties
    [JsonIgnore]
    public virtual StockTransfer StockTransfer { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
