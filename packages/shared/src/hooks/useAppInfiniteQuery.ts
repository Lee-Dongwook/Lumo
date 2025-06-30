import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type QueryKey,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query'

export function useAppInfiniteQuery<
  TQueryFnData,
  TError = unknown,
  TData = TQueryFnData,
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    QueryKey,
    TPageParam
  >,
): UseInfiniteQueryResult<TData, TError> {
  return useInfiniteQuery(options)
}
