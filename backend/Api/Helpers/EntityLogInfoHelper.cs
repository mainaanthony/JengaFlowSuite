using Api.Core.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Api.Helpers;

public static class EntityLogInfoHelper
{
    public static EntityLogInfo GetLogInfo(IHttpContextAccessor httpContextAccessor)
    {
        var httpContext = httpContextAccessor.HttpContext;

        if (httpContext == null)
        {
            return new EntityLogInfo
            {
                ChangedBy = "System",
                ChangeTrigger = "GraphQL"
            };
        }

        // Extract user information from JWT claims (Keycloak)
        var user = httpContext.User;
        string? changedBy = null;

        if (user?.Identity?.IsAuthenticated == true)
        {
            // Try multiple claim types in order of preference
            changedBy = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? user.FindFirst("sub")?.Value
                       ?? user.FindFirst("preferred_username")?.Value
                       ?? user.FindFirst(ClaimTypes.Email)?.Value
                       ?? user.FindFirst("email")?.Value
                       ?? user.FindFirst(ClaimTypes.Name)?.Value
                       ?? user.FindFirst("name")?.Value;
        }

        // Fallback to IP address or Anonymous
        if (string.IsNullOrEmpty(changedBy))
        {
            var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();
            changedBy = ipAddress ?? "Anonymous";
        }

        return new EntityLogInfo
        {
            ChangedBy = changedBy,
            ChangeTrigger = "GraphQL",
            ChangeReason = null
        };
    }
}
