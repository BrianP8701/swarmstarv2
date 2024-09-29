import { useFetchUserQuery } from "../graphql/generated/graphql";

export function useFetchUser() {
  const { data, loading, error } = useFetchUserQuery();
  
  return {
    user: data?.user,
    loading,
    error
  };
}
