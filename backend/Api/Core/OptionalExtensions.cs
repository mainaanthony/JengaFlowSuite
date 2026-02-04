namespace Api.Core
{
    public static class OptionalExtensions
    {
        public static T CheckForValue<T>(this Optional<T> optional, T currentValue)
        {
            return optional.HasValue ? optional.Value! : currentValue;
        }

        public static void CheckRequired<T>(this Optional<T> optional, string? fieldName = null)
        {
            if (!optional.HasValue || optional.Value == null)
            {
                throw new ArgumentException($"{fieldName ?? "Field"} is required");
            }
        }
    }
}
