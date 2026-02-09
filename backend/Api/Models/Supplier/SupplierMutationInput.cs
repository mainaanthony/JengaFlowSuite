using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

public record SupplierMutationInput
(
    [property: DefaultValue(0)]
    Optional<int> Id,

    [property: DefaultValue("")]
    Optional<string> Name,

    [property: DefaultValue("")]
    Optional<string?> ContactPerson,

    [property: DefaultValue("")]
    Optional<string> Phone,

    [property: DefaultValue("")]
    Optional<string> Email,

    [property: DefaultValue("")]
    Optional<string?> Address,

    [property: DefaultValue("")]
    Optional<string?> Category,

    [property: DefaultValue(0)]
    Optional<decimal> Rating,

    [property: DefaultValue(true)]
    Optional<bool> IsActive
);

// Simple input records for future use
public record CreateSupplierInput(
    string Name,
    string? ContactPerson,
    string Phone,
    string Email,
    string? Address,
    bool IsActive = true
);

public record UpdateSupplierInput(
    int Id,
    string Name,
    string? ContactPerson,
    string Phone,
    string Email,
    string? Address,
    bool IsActive
);
