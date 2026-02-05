using System.Text.Json.Serialization;
using Api.Core.Models;

namespace Api.Models;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    [JsonIgnore]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
