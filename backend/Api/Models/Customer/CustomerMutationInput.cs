using HotChocolate;
using HotChocolate.Types;
using Api.Enums;

namespace Api.Models;

public record CustomerMutationInput
(
    [property: DefaultValue(0)]
    Optional<int> Id,

    [property: DefaultValue("")]
    Optional<string> Name,

    [property: DefaultValue("")]
    Optional<string?> Phone,

    [property: DefaultValue("")]
    Optional<string?> Email,

    [property: DefaultValue("")]
    Optional<string?> Address,

    Optional<CustomerType> CustomerType,

    [property: DefaultValue(true)]
    Optional<bool> IsActive
);
