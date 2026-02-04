using HotChocolate;
using HotChocolate.Types;
using Api.Enums;

namespace Api.Models.TaxReturn
{
    public record TaxReturnMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue("")]
        public Optional<string> Period { get; set; }

        [DefaultValue(Enums.TaxType.VAT)]
        public Optional<TaxType> TaxType { get; set; }

        [DefaultValue(0)]
        public Optional<decimal> Amount { get; set; }

        [DefaultValue(TaxReturnStatus.Draft)]
        public Optional<TaxReturnStatus> Status { get; set; }

        [DefaultValue(null)]
        public Optional<DateTime?> DueDate { get; set; }

        [DefaultValue(null)]
        public Optional<DateTime?> SubmittedDate { get; set; }

        [DefaultValue(null)]
        public Optional<int?> SubmittedByUserId { get; set; }

        [DefaultValue(null)]
        public Optional<string?> ReferenceNumber { get; set; }
    }
}
