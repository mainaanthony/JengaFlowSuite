using HotChocolate;
using HotChocolate.Types;
using Api.Enums;

namespace Api.Models.StockTransfer
{
    public record StockTransferMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue("")]
        public Optional<string> TransferNumber { get; set; }

        [DefaultValue(0)]
        public Optional<int> FromBranchId { get; set; }

        [DefaultValue(0)]
        public Optional<int> ToBranchId { get; set; }

        [DefaultValue(0)]
        public Optional<int> RequestedByUserId { get; set; }

        [DefaultValue(null)]
        public Optional<int?> ApprovedByUserId { get; set; }

        [DefaultValue(StockTransferStatus.Pending)]
        public Optional<StockTransferStatus> Status { get; set; }

        [DefaultValue(null)]
        public Optional<DateTime?> CompletedDate { get; set; }

        [DefaultValue(null)]
        public Optional<string?> Notes { get; set; }
    }
}
