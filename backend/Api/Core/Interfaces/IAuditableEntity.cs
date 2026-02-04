namespace Api.Core.Interfaces
{
    public interface IAuditableEntity : IEntity
    {
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
