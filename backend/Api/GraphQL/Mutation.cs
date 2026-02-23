namespace Api.GraphQL
{
    /// <summary>
    /// Root Mutation type
    /// Extended by mutation classes using [ExtendObjectType("Mutation")]
    /// </summary>
    public class Mutation
    {
        // Placeholder method to satisfy GraphQL schema requirements
        public string Version() => "1.0";
    }
}
