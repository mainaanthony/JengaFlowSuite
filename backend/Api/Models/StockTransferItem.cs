using System.Text.Json.Serialization;

namespace Api.Models
{
    public class StockTransferItem
    {
        public int Id { get; set; }
        public int StockTransferId { get; set; }
        public int ProductId { get; set; }
        public int QuantityRequested { get; set; }
        public int? QuantityTransferred { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public virtual StockTransfer StockTransfer { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
