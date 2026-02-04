using HotChocolate;
using HotChocolate.Types;

namespace Api.Models.Product
{
    public record ProductMutationInput
    (
        [property: DefaultValue(0)]
        Optional<int> Id,

        [property: DefaultValue("")]
        Optional<string> Name,

        [property: DefaultValue("")]
        Optional<string> SKU,

        [property: DefaultValue("")]
        Optional<string?> Brand,

        [property: DefaultValue(0)]
        Optional<int?> CategoryId,

        [property: DefaultValue(0)]
        Optional<decimal> Price,

        [property: DefaultValue("")]
        Optional<string?> Description,

        [property: DefaultValue(true)]
        Optional<bool> IsActive
    );
}
