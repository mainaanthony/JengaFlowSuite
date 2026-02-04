using HotChocolate;
using HotChocolate.Types;

namespace Api.Models.Branch
{
    public record BranchMutationInput
    (
        [property: DefaultValue(0)]
        Optional<int> Id,

        [property: DefaultValue("")]
        Optional<string> Name,

        [property: DefaultValue("")]
        Optional<string> Code,

        [property: DefaultValue("")]
        Optional<string?> Address,

        [property: DefaultValue("")]
        Optional<string?> City,

        [property: DefaultValue("")]
        Optional<string?> Phone,

        [property: DefaultValue("")]
        Optional<string?> Email,

        [property: DefaultValue(true)]
        Optional<bool> IsActive
    );
}
