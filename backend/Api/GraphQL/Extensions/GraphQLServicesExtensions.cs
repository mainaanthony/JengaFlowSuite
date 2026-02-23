using Api.Services;
using HotChocolate.Execution.Configuration;

namespace Api.GraphQL.Extensions;

public static class GraphQLServicesExtensions
{
    public static IRequestExecutorBuilder AddGraphQLServices(this IRequestExecutorBuilder builder)
    {
        // Register all service interfaces for GraphQL dependency injection
        builder
            .RegisterService<IBranchService>()
            .RegisterService<ICategoryService>()
            .RegisterService<ICustomerService>()
            .RegisterService<IDeliveryService>()
            .RegisterService<IDeliveryItemService>()
            .RegisterService<IDriverService>()
            .RegisterService<IGoodsReceivedNoteService>()
            .RegisterService<IGoodsReceivedNoteItemService>()
            .RegisterService<IInventoryService>()
            .RegisterService<IProductService>()
            .RegisterService<IPurchaseOrderService>()
            .RegisterService<IPurchaseOrderItemService>()
            .RegisterService<IRoleService>()
            .RegisterService<ISaleService>()
            .RegisterService<ISaleItemService>()
            .RegisterService<IStockTransferService>()
            .RegisterService<IStockTransferItemService>()
            .RegisterService<ISupplierService>()
            .RegisterService<ITaxReturnService>()
            .RegisterService<IUserService>();

        return builder;
    }
}
