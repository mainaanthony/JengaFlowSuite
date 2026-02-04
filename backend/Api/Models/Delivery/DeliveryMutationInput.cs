using HotChocolate;
using HotChocolate.Types;
using Api.Enums;

namespace Api.Models.Delivery
{
    public record DeliveryMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue("")]
        public Optional<string> DeliveryNumber { get; set; }

        [DefaultValue(null)]
        public Optional<int?> SaleId { get; set; }

        [DefaultValue(0)]
        public Optional<int> CustomerId { get; set; }

        [DefaultValue(0)]
        public Optional<int> DriverId { get; set; }

        [DefaultValue("")]
        public Optional<string> DeliveryAddress { get; set; }

        [DefaultValue(null)]
        public Optional<string?> ContactPhone { get; set; }

        [DefaultValue(DeliveryStatus.Scheduled)]
        public Optional<DeliveryStatus> Status { get; set; }

        [DefaultValue(Enums.Priority.Normal)]
        public Optional<Priority> Priority { get; set; }

        [DefaultValue(null)]
        public Optional<DateTime?> ScheduledDate { get; set; }

        [DefaultValue(null)]
        public Optional<DateTime?> DeliveredDate { get; set; }

        [DefaultValue(null)]
        public Optional<string?> Notes { get; set; }
    }
}
