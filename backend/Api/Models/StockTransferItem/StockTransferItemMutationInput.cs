using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

public record StockTransferItemMutationInput
{
    [DefaultValue(0)]
    public Optional<int> Id { get; set; }

    [DefaultValue(0)]
    public Optional<int> StockTransferId { get; set; }

    [DefaultValue(0)]
    public Optional<int> ProductId { get; set; }

    [DefaultValue(0)]
    public Optional<int> QuantityRequested { get; set; }

    [DefaultValue(null)]
    public Optional<int?> QuantityTransferred { get; set; }
}
