import { useFetchUserQuery } from "../graphql/generated/graphql";

export function useFetchUser() {
  const { data, loading, error } = useFetchUserQuery();
  
  return {
    user: data?.fetchUser,
    loading,
    error
  };
}
