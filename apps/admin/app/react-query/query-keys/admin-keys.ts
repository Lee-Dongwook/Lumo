export const adminQueryKeys = {
  programSet: {
    allPublishedProgramSet: ['allPublishedProgramSet'] as const,
    pagination: (pagination: {
      offset: number
      size: number
      order: 'asc' | 'desc'
      query: string
    }) => ['allPublishedProgramSet', pagination] as const,
  },
  habit: {
    allPublishedHabit: ['allPublishedHabit'] as const,
    pagination: (pagination: {
      offset: number
      size: number
      order: 'asc' | 'desc'
      query: string
    }) => ['allPublishedHabit', pagination] as const,
  },
}
