namespace Api.GraphQL
{
    /// <summary>
    /// Root Query type
    /// Extended by query classes using [ExtendObjectType("Query")]
    /// </summary>
    public class Query
    {
        // Placeholder method to satisfy GraphQL schema requirements
        public string Version() => "1.0";
    }
}
