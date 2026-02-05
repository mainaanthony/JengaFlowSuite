using System.Text.Json.Serialization;
using Api.Core.Models;
using Api.Enums;

namespace Api.Models;

public class Customer : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public CustomerType CustomerType { get; set; } = CustomerType.Individual;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    [JsonIgnore]
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
    [JsonIgnore]
    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
}
