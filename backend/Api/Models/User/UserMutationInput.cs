using HotChocolate;
using HotChocolate.Types;

namespace Api.Models.User
{
    public record UserMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue("")]
        public Optional<string> KeycloakId { get; set; }

        [DefaultValue("")]
        public Optional<string> Username { get; set; }

        [DefaultValue("")]
        public Optional<string> Email { get; set; }

        [DefaultValue("")]
        public Optional<string> FirstName { get; set; }

        [DefaultValue("")]
        public Optional<string> LastName { get; set; }

        [DefaultValue(null)]
        public Optional<string?> Phone { get; set; }

        [DefaultValue(true)]
        public Optional<bool> IsActive { get; set; }

        [DefaultValue(0)]
        public Optional<int> BranchId { get; set; }

        [DefaultValue(0)]
        public Optional<int> RoleId { get; set; }
    }
}
