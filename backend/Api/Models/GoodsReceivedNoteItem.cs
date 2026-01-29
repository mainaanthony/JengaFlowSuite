using System.Text.Json.Serialization;

namespace Api.Models
{
    public class GoodsReceivedNoteItem
    {
        public int Id { get; set; }
        public int GoodsReceivedNoteId { get; set; }
        public int ProductId { get; set; }
        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public virtual GoodsReceivedNote GoodsReceivedNote { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
