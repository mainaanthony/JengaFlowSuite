using HotChocolate;
using HotChocolate.Types;

namespace Api.Models.Driver
{
    public record DriverMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue("")]
        public Optional<string> Name { get; set; }

        [DefaultValue("")]
        public Optional<string> Phone { get; set; }

        [DefaultValue(null)]
        public Optional<string?> LicenseNumber { get; set; }

        [DefaultValue("")]
        public Optional<string> Vehicle { get; set; }

        [DefaultValue(null)]
        public Optional<string?> VehicleRegistration { get; set; }

        [DefaultValue("Available")]
        public Optional<string> Status { get; set; }

        [DefaultValue(0)]
        public Optional<decimal> Rating { get; set; }

        [DefaultValue(true)]
        public Optional<bool> IsActive { get; set; }
    }
}
