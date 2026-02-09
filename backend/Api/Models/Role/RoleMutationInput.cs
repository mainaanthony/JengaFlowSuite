using HotChocolate;
using HotChocolate.Types;

namespace Api.Models;

public record RoleMutationInput
{
    [DefaultValue(0)]
    public Optional<int> Id { get; set; }

    [DefaultValue("")]
    public Optional<string> Name { get; set; }

    [DefaultValue(null)]
    public Optional<string?> Description { get; set; }
}

// Simple input records for future use
public record CreateRoleInput(
    string Name,
    string? Description
);

public record UpdateRoleInput(
    int Id,
    string Name,
    string? Description
);
