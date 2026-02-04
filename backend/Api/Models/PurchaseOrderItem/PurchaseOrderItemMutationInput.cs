using HotChocolate;
using HotChocolate.Types;

namespace Api.Models.PurchaseOrderItem
{
    public record PurchaseOrderItemMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue(0)]
        public Optional<int> PurchaseOrderId { get; set; }

        [DefaultValue(0)]
        public Optional<int> ProductId { get; set; }

        [DefaultValue(0)]
        public Optional<int> Quantity { get; set; }

        [DefaultValue(0)]
        public Optional<decimal> UnitPrice { get; set; }

        [DefaultValue(0)]
        public Optional<decimal> TotalPrice { get; set; }
    }
}
