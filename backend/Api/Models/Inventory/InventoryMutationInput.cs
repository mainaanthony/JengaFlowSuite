using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

public record InventoryMutationInput
{
    [DefaultValue(0)]
    public Optional<int> Id { get; set; }

    [DefaultValue(0)]
    public Optional<int> ProductId { get; set; }

    [DefaultValue(0)]
    public Optional<int> BranchId { get; set; }

    [DefaultValue(0)]
    public Optional<int> Quantity { get; set; }

    [DefaultValue(10)]
    public Optional<int> ReorderLevel { get; set; }

    [DefaultValue(100)]
    public Optional<int> MaxStockLevel { get; set; }
}
