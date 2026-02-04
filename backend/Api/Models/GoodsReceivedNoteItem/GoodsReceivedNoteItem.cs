using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models.GoodsReceivedNoteItem
{
    public class GoodsReceivedNoteItem : BaseEntity
    {
        public int GoodsReceivedNoteId { get; set; }
        public int ProductId { get; set; }
        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; }
        public string? Remarks { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual GoodsReceivedNote.GoodsReceivedNote GoodsReceivedNote { get; set; } = null!;
        public virtual Product.Product Product { get; set; } = null!;
    }
}
