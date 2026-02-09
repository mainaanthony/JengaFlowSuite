using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

public record CategoryMutationInput
(
    [property: DefaultValue(0)]
    Optional<int> Id,

    [property: DefaultValue("")]
    Optional<string> Name,

    [property: DefaultValue("")]
    Optional<string?> Description,

    [property: DefaultValue(true)]
    Optional<bool> IsActive
);

// Simple input records for future use
public record CreateCategoryInput(
    string Name,
    string? Description,
    bool IsActive = true
);

public record UpdateCategoryInput(
    int Id,
    string Name,
    string? Description,
    bool IsActive
);
