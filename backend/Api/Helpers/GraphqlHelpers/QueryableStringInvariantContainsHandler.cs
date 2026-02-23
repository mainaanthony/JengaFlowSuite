using System.Linq.Expressions;
using HotChocolate.Data.Filters;
using HotChocolate.Data.Filters.Expressions;
using HotChocolate.Language;

namespace Api.Helpers.GraphqlHelpers;

public class QueryableStringInvariantContainsHandler : QueryableStringOperationHandler
{
    public QueryableStringInvariantContainsHandler(InputParser inputParser) : base(inputParser)
    {
    }

    protected override int Operation => DefaultFilterOperations.Contains;

    public override Expression HandleOperation(
        QueryableFilterContext context,
        IFilterOperationField field,
        IValueNode value,
        object? parsedValue)
    {
        var property = context.GetInstance();

        if (parsedValue is string str)
        {
            var toLower = Expression.Call(
                property,
                typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes)!);

            return Expression.Call(
                toLower,
                typeof(string).GetMethod(
                    nameof(string.Contains),
                    new[] { typeof(string) })!,
                Expression.Constant(str.ToLower()));
        }

        throw new InvalidOperationException();
    }
}
