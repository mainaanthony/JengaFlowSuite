using HotChocolate;
using HotChocolate.Types;
using Api.Enums;

namespace Api.Models;

public record SaleItemInput
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal? Discount { get; set; }
}

public record SaleMutationInput
{
    [DefaultValue(0)]
    public Optional<int> Id { get; set; }

    [DefaultValue("")]
    public Optional<string> SaleNumber { get; set; }

    [DefaultValue(0)]
    public Optional<int> CustomerId { get; set; }

    [DefaultValue(0)]
    public Optional<int> BranchId { get; set; }

    [DefaultValue(0)]
    public Optional<int> AttendantUserId { get; set; }

    [DefaultValue(0)]
    public Optional<decimal> TotalAmount { get; set; }

    [DefaultValue(Enums.PaymentMethod.Cash)]
    public Optional<PaymentMethod> PaymentMethod { get; set; }

    [DefaultValue(OrderStatus.Completed)]
    public Optional<OrderStatus> Status { get; set; }

    [DefaultValue(null)]
    public Optional<string?> Notes { get; set; }

    /// <summary>
    /// Sale items - for creation with nested items (backend calculates totals)
    /// </summary>
    [DefaultValue(null)]
    public Optional<List<SaleItemInput>?> Items { get; set; }
}
