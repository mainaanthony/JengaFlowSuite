using Api.Enums;

namespace Api.Core.Interfaces
{
    public interface IEntityLogInfo
    {
        public string ChangedBy { get; set; }
        public string ChangeTrigger { get; set; }
        public string? ChangeReason { get; set; }
    }
}
