using Api.Core.Models;
using Microsoft.AspNetCore.Http;

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

        // Try to get user from claims (when authentication is implemented)
        var userId = httpContext.User?.Identity?.Name;
        var userEmail = httpContext.User?.FindFirst("email")?.Value
                       ?? httpContext.User?.FindFirst("preferred_username")?.Value;

        // Get client IP for audit trail
        var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();

        return new EntityLogInfo
        {
            ChangedBy = userId ?? userEmail ?? ipAddress ?? "Anonymous",
            ChangeTrigger = "GraphQL",
            ChangeReason = null
        };
    }
}
