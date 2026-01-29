using System.Text.Json.Serialization;
using Api.Enums;

namespace Api.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public string SaleNumber { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public int BranchId { get; set; }
        public int AttendantUserId { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
        public OrderStatus Status { get; set; } = OrderStatus.Completed;
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual Customer Customer { get; set; } = null!;
        public virtual Branch Branch { get; set; } = null!;
        public virtual User AttendantUser { get; set; } = null!;

        [JsonIgnore]
        public virtual ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
    }
}
