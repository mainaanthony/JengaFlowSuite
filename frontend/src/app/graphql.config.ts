import { ApplicationConfig } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';

export function apolloConfigFactory(): void {
  const apollo = inject(Apollo);
  const httpLink = inject(HttpLink);

  // Create the HTTP link to the GraphQL server
  const http = httpLink.create({
    uri: 'http://localhost:5001/graphql',
  });

  // Create Apollo Client
  apollo.create({
    link: http,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}
