import {
  ApolloClient,
  ApolloLink,
  GraphQLRequest,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { sha256 } from "crypto-hash";
import { createClient } from "graphql-ws";
import { Articles } from "../graphql/types";
import { handleRefreshToken } from "../utils/refreshToken";

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_URL_SERVER_SOCKET,
  })
);
export const apolloRefreshToken = new ApolloClient({
  uri: import.meta.env.VITE_URL_SERVER,
  cache: new InMemoryCache(),
});

function isRefreshRequest(operation: GraphQLRequest) {
  return operation.operationName === "refreshToken";
}

// Returns accesstoken if opoeration is not a refresh token request
function returnTokenDependingOnOperation(operation: GraphQLRequest) {
  if (isRefreshRequest(operation))
    return localStorage.getItem("refreshToken") || "";
  else return localStorage.getItem("accessToken") || "";
}

const linkChain = createPersistedQueryLink({
  sha256,
  // useGETForHashedQueries: true,
}).concat(new HttpLink({ uri: import.meta.env.VITE_URL_SERVER }));
const authLink = setContext(async (operation, { headers }) => {
  try {
    await handleRefreshToken();
  } catch (error) {}
  const token = returnTokenDependingOnOperation(operation);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  linkChain
);
const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getListArticlesByAuthor: {
            keyArgs: false,
            merge(existing: Articles | undefined, incoming: Articles) {
              if (!existing) return incoming;
              return {
                code: 200,
                success: true,
                message: incoming.count === 0 ? "full" : "get success",
                count: existing.count + incoming.count,
                articles: [...existing.articles, ...incoming.articles],
              };
            },
          },
          getFavoritedArticles: {
            keyArgs: false,

            merge(existing: Articles | undefined, incoming: Articles) {
              if (!existing) return incoming;
              return {
                code: 200,
                success: true,
                message: incoming.count === 0 ? "full" : "get success",
                count: existing.count + incoming.count,
                articles: [...existing.articles, ...incoming.articles],
              };
            },
          },
        },
      },
    },
  }),
  link: ApolloLink.from([authLink, splitLink]),
});

export default client;
