using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation properties
    [JsonIgnore]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
