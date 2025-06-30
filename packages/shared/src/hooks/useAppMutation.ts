import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query'

export function useAppMutation<TData, TError, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>,
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables, unknown>({
    mutationFn,
    ...options,
  })
}
