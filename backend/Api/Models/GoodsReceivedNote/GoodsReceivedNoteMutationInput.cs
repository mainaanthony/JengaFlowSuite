using HotChocolate;
using HotChocolate.Types;
using Api.Enums;

namespace Api.Models.GoodsReceivedNote
{
    public record GoodsReceivedNoteMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue("")]
        public Optional<string> GRNNumber { get; set; }

        [DefaultValue(0)]
        public Optional<int> PurchaseOrderId { get; set; }

        [DefaultValue(0)]
        public Optional<int> ReceivedByUserId { get; set; }

        [DefaultValue(null)]
        public Optional<DateTime?> ReceivedDate { get; set; }

        [DefaultValue(null)]
        public Optional<string?> Notes { get; set; }

        [DefaultValue(GoodsReceivedNoteStatus.FullyReceived)]
        public Optional<GoodsReceivedNoteStatus> Status { get; set; }
    }
}
