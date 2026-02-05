using System.Text.Json.Serialization;
using Api.Core.Models;
using Api.Enums;

namespace Api.Models;

public class TaxReturn : BaseEntity
{
    public string Period { get; set; } = string.Empty; // e.g., "December 2023"
    public TaxType TaxType { get; set; } = TaxType.VAT;
    public decimal Amount { get; set; }
    public TaxReturnStatus Status { get; set; } = TaxReturnStatus.Draft;
    public DateTime DueDate { get; set; }
    public DateTime? SubmittedDate { get; set; }
    public int? SubmittedByUserId { get; set; }
    public string? ReferenceNumber { get; set; }

    // Navigation properties
    public virtual User? SubmittedByUser { get; set; }
}
