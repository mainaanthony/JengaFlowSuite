using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

public record DeliveryItemMutationInput
{
    [DefaultValue(0)]
    public Optional<int> Id { get; set; }

    [DefaultValue(0)]
    public Optional<int> DeliveryId { get; set; }

    [DefaultValue(0)]
    public Optional<int> ProductId { get; set; }

    [DefaultValue(0)]
    public Optional<int> Quantity { get; set; }
}
