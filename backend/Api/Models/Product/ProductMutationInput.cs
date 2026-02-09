using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

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

// Simple input records for future use
public record CreateProductInput(
    string Name,
    string SKU,
    string? Brand,
    int? CategoryId,
    decimal Price,
    string? Description,
    bool IsActive = true
);

public record UpdateProductInput(
    int Id,
    string Name,
    string SKU,
    string? Brand,
    int? CategoryId,
    decimal Price,
    string? Description,
    bool IsActive
);
