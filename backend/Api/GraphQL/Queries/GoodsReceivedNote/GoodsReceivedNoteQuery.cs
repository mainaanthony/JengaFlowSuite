using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [QueryType]
    public static class GoodsReceivedNoteQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<GoodsReceivedNote> GetGoodsReceivedNotes([Service] IGoodsReceivedNoteService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<GoodsReceivedNote?> GetGoodsReceivedNote(int id, [Service] IGoodsReceivedNoteService service)
            => await service.GetByIdAsync(id);

        [UseProjection]
        public static async Task<GoodsReceivedNote?> GetGoodsReceivedNoteByGRNNumber(string grnNumber, [Service] IGoodsReceivedNoteService service)
            => await service.GetByGRNNumberAsync(grnNumber);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<GoodsReceivedNote>> GetGoodsReceivedNotesByPurchaseOrder(int purchaseOrderId, [Service] IGoodsReceivedNoteService service)
            => await service.GetByPurchaseOrderIdAsync(purchaseOrderId);
    }
}
