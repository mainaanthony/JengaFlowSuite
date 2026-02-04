using Api.Core.Interfaces;

namespace Api.Core.Models
{
    public class EntityLog : IEntityLog
    {
        public int Id { get; set; }
        public int EntityId { get; set; }
        public string EntityName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string ChangedBy { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string? ChangeReason { get; set; }
    }
}
