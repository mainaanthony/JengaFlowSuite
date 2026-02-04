namespace Api.Core.Interfaces
{
    public interface IEntityLog
    {
        public int Id { get; set; }
        public int EntityId { get; set; }
        public string EntityName { get; set; }
        public string Action { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangedAt { get; set; }
        public string? ChangeReason { get; set; }
    }
}
