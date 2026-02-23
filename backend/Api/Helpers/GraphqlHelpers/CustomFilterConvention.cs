using HotChocolate.Data.Filters;

namespace Api.Helpers.GraphqlHelpers;

public class CustomFilterConvention : FilterConvention
{
    protected override void Configure(IFilterConventionDescriptor descriptor)
    {
        descriptor.AddDefaults();
        descriptor.BindRuntimeType<string, StringOperationFilterInputType>();
        descriptor.Operation(DefaultFilterOperations.Contains).Name("contains");
    }
}
