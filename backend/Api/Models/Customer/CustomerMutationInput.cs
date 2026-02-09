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

// Simple input records for future use
public record CreateCustomerInput(
    string Name,
    string? Phone,
    string? Email,
    string? Address,
    CustomerType CustomerType = CustomerType.Individual,
    bool IsActive = true
);

public record UpdateCustomerInput(
    int Id,
    string Name,
    string? Phone,
    string? Email,
    string? Address,
    CustomerType CustomerType,
    bool IsActive
);
