import { ApolloError } from "@apollo/client";
import { FetchUserQueryResult, useFetchUserQuery, User } from "../graphql/generated/graphql";

export function useFetchUser(): {
  user: User | null;
  loading: boolean;
  error: ApolloError | null;
  refetch: () => Promise<FetchUserQueryResult>;
} {
  const { data, loading, error, refetch } = useFetchUserQuery({
    fetchPolicy: 'cache-and-network',
  });
  
  return {
    user: data?.user || null,
    loading,
    error: error || null,
    refetch: refetch as () => Promise<FetchUserQueryResult>
  };
}
