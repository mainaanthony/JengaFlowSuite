using Api.Models;
using Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations;

public class UserProvisioningService : IUserProvisioningService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly ILogger<UserProvisioningService> _logger;

    public UserProvisioningService(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IBranchRepository branchRepository,
        ILogger<UserProvisioningService> logger)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _branchRepository = branchRepository;
        _logger = logger;
    }

    public async Task<User> GetOrCreateUserFromTokenAsync(
        string keycloakId,
        string username,
        string email,
        string? firstName,
        string? lastName)
    {
        // Try to find existing user
        var user = await _userRepository.GetByKeycloakIdAsync(keycloakId);

        if (user != null)
        {
            // Update last login time
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("User {Username} logged in. KeycloakId: {KeycloakId}", username, keycloakId);
            return user;
        }

        // User doesn't exist - auto-provision from JWT claims
        _logger.LogInformation("Auto-provisioning new user {Username} with KeycloakId: {KeycloakId}", username, keycloakId);

        // Assign default role and branch
        var defaultRole = await _roleRepository.GetByIdAsync(1); // Admin role
        var defaultBranch = await _branchRepository.GetByIdAsync(1); // Head Office

        if (defaultRole == null || defaultBranch == null)
        {
            throw new InvalidOperationException("Default role or branch not found. Ensure seed data is applied.");
        }

        // Create new user
        var newUser = new User
        {
            KeycloakId = keycloakId,
            Username = username,
            Email = email,
            FirstName = firstName ?? "Unknown",
            LastName = lastName ?? "User",
            IsActive = true,
            RoleId = defaultRole.Id,
            BranchId = defaultBranch.Id,
            LastLoginAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System-AutoProvision"
        };

        await _userRepository.AddAsync(newUser);

        _logger.LogInformation(
            "Successfully auto-provisioned user {Username} (ID: {UserId}) with role {Role} at branch {Branch}",
            newUser.Username,
            newUser.Id,
            defaultRole.Name,
            defaultBranch.Name);

        return newUser;
    }
}
