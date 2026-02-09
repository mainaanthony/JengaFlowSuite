using HotChocolate;
using HotChocolate.Types;
using Api.Enums;

namespace Api.Models;

public record PurchaseOrderItemInput
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public record PurchaseOrderMutationInput
{
    [DefaultValue(0)]
    public Optional<int> Id { get; set; }

    [DefaultValue("")]
    public Optional<string> PONumber { get; set; }

    [DefaultValue(0)]
    public Optional<int> SupplierId { get; set; }

    [DefaultValue(0)]
    public Optional<int> CreatedByUserId { get; set; }

    [DefaultValue(null)]
    public Optional<int?> ApprovedByUserId { get; set; }

    [DefaultValue(0)]
    public Optional<decimal> TotalAmount { get; set; }

    [DefaultValue(OrderStatus.Pending)]
    public Optional<OrderStatus> Status { get; set; }

    [DefaultValue(null)]
    public Optional<DateTime?> ExpectedDeliveryDate { get; set; }

    [DefaultValue(null)]
    public Optional<DateTime?> DeliveredDate { get; set; }

    [DefaultValue(null)]
    public Optional<string?> Notes { get; set; }

    /// <summary>
    /// Purchase order items - for creation with nested items (backend calculates totals)
    /// </summary>
    [DefaultValue(null)]
    public Optional<List<PurchaseOrderItemInput>?> Items { get; set; }
}
