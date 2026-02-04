using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models.PurchaseOrderItem
{
    public class PurchaseOrderItem : BaseEntity
    {
        public int PurchaseOrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual PurchaseOrder.PurchaseOrder PurchaseOrder { get; set; } = null!;
        public virtual Product.Product Product { get; set; } = null!;
    }
}
