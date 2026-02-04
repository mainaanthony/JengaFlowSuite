using Api.Models.GoodsReceivedNoteItem;
using Api.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Api.GraphQL.Queries.GoodsReceivedNoteItem
{
    [QueryType]
    public static class GoodsReceivedNoteItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<Models.GoodsReceivedNoteItem.GoodsReceivedNoteItem> GetGoodsReceivedNoteItems([Service] IGoodsReceivedNoteItemService service)
            => service.GetQueryable();

        [UseProjection]
        public static async Task<Models.GoodsReceivedNoteItem.GoodsReceivedNoteItem?> GetGoodsReceivedNoteItem(int id, [Service] IGoodsReceivedNoteItemService service)
            => await service.GetByIdAsync(id);

        [UseFiltering]
        [UseSorting]
        public static async Task<IEnumerable<Models.GoodsReceivedNoteItem.GoodsReceivedNoteItem>> GetGoodsReceivedNoteItemsByGoodsReceivedNote(int goodsReceivedNoteId, [Service] IGoodsReceivedNoteItemService service)
            => await service.GetByGoodsReceivedNoteIdAsync(goodsReceivedNoteId);
    }
}
