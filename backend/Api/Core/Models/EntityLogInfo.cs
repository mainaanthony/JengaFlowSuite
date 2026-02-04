using Api.Core.Interfaces;

namespace Api.Core.Models
{
    public class EntityLogInfo : IEntityLogInfo
    {
        public string ChangedBy { get; set; } = string.Empty;
        public string ChangeTrigger { get; set; } = string.Empty;
        public string? ChangeReason { get; set; }
    }
}
