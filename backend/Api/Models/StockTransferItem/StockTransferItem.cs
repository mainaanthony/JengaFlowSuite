using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models.StockTransferItem
{
    public class StockTransferItem : BaseEntity
    {
        public int StockTransferId { get; set; }
        public int ProductId { get; set; }
        public int QuantityRequested { get; set; }
        public int? QuantityTransferred { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual StockTransfer.StockTransfer StockTransfer { get; set; } = null!;
        public virtual Product.Product Product { get; set; } = null!;
    }
}
