import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query'

export function useAppQuery<TQueryFnData, TError, TData = TQueryFnData>(
  key: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<TQueryFnData, TError, TData, QueryKey>({
    queryKey: key,
    queryFn,
    ...options,
  })
}
