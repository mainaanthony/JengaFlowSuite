using Api.Models;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public static class GoodsReceivedNoteItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<GoodsReceivedNoteItem> GetGoodsReceivedNoteItems([Service] IGoodsReceivedNoteItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<GoodsReceivedNoteItem?> GetGoodsReceivedNoteItem(int id, [Service] IGoodsReceivedNoteItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<GoodsReceivedNoteItem>> GetGoodsReceivedNoteItemsByGoodsReceivedNote(int goodsReceivedNoteId, [Service] IGoodsReceivedNoteItemService service)
            => await service.GetByGoodsReceivedNoteIdAsync(goodsReceivedNoteId);
    }
}
