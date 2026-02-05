using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

public record SaleItemMutationInput
{
    [DefaultValue(0)]
    public Optional<int> Id { get; set; }

    [DefaultValue(0)]
    public Optional<int> SaleId { get; set; }

    [DefaultValue(0)]
    public Optional<int> ProductId { get; set; }

    [DefaultValue(0)]
    public Optional<int> Quantity { get; set; }

    [DefaultValue(0)]
    public Optional<decimal> UnitPrice { get; set; }

    [DefaultValue(0)]
    public Optional<decimal> TotalPrice { get; set; }

    [DefaultValue(null)]
    public Optional<decimal?> Discount { get; set; }
}
