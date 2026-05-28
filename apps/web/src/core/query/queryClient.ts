import { QueryClient } from "@tanstack/react-query";

let client: QueryClient;

export function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
          refetchOnMount: true,
          refetchOnWindowFocus: false,
        },
      },
    });
  }
  return client;
}
