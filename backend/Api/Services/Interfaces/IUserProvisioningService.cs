using Api.Models;

namespace Api.Services;

public interface IUserProvisioningService
{
    Task<User> GetOrCreateUserFromTokenAsync(string keycloakId, string username, string email, string? firstName, string? lastName);
}
