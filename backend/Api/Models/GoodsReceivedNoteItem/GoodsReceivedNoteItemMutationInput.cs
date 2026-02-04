using HotChocolate;
using HotChocolate.Types;

namespace Api.Models.GoodsReceivedNoteItem
{
    public record GoodsReceivedNoteItemMutationInput
    {
        [DefaultValue(0)]
        public Optional<int> Id { get; set; }

        [DefaultValue(0)]
        public Optional<int> GoodsReceivedNoteId { get; set; }

        [DefaultValue(0)]
        public Optional<int> ProductId { get; set; }

        [DefaultValue(0)]
        public Optional<int> QuantityOrdered { get; set; }

        [DefaultValue(0)]
        public Optional<int> QuantityReceived { get; set; }

        [DefaultValue(null)]
        public Optional<string?> Remarks { get; set; }
    }
}
