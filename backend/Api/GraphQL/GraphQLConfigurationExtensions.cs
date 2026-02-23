using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using HotChocolate.Execution.Configuration;
using Api.GraphQL.Extensions;
using Api.Helpers.GraphqlHelpers;
using Api.Data;

namespace Api.GraphQL
{
    public static class GraphQLConfigurationExtensions
    {
        /// <summary>
        /// Configures GraphQL server with automatic type discovery, custom filtering, and service registration
        /// </summary>
        public static IServiceCollection AddGraphQLConfig(
            this IServiceCollection services,
            IWebHostEnvironment environment)
        {
            services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                .AddMutationType<Mutation>()
                .RegisterDbContext<AppDbContext>(DbContextKind.Synchronized)
                .AddApiTypes()  // Source-generated extension method that registers all Query and Mutation types
                .AddGraphQLServices()  // Registers all service interfaces
                .AddProjections()
                .AddFiltering<CustomFilterConvention>()
                .AddSorting()
                .ModifyRequestOptions(opt =>
                    opt.IncludeExceptionDetails = environment.IsDevelopment());

            return services;
        }
    }
}
