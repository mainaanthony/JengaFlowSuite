using Api.Core.Interfaces;

namespace Api.Core.Models
{
    public abstract class AuditableEntity : BaseEntity, IAuditableEntity
    {
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
