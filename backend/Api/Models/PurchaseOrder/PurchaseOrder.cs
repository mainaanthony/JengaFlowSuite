using System.Text.Json.Serialization;
using Api.Core.Models;
using Api.Enums;

namespace Api.Models.PurchaseOrder
{
    public class PurchaseOrder : AuditableEntity
    {
        public string PONumber { get; set; } = string.Empty;
        public int SupplierId { get; set; }
        public int CreatedByUserId { get; set; }
        public int? ApprovedByUserId { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public DateTime ExpectedDeliveryDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public virtual Supplier.Supplier Supplier { get; set; } = null!;
        public virtual User.User CreatedByUser { get; set; } = null!;
        public virtual User.User? ApprovedByUser { get; set; }

        [JsonIgnore]
        public virtual ICollection<PurchaseOrderItem.PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem.PurchaseOrderItem>();
        [JsonIgnore]
        public virtual ICollection<GoodsReceivedNote.GoodsReceivedNote> GoodsReceivedNotes { get; set; } = new List<GoodsReceivedNote.GoodsReceivedNote>();
    }
}
