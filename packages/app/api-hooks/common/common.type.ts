export interface ApiResponse<T> {
  ok: boolean
  data: T
}

export interface PaginationResponse {
  totalCount: number
  lastOffset: number
}

export interface PaginationParams {
  offset?: number
  size: number
  order: 'asc' | 'desc'
  search?: string
}

export interface BaseEntity {
  id: number
  uuid: string
  createdAt: string
  updatedAt: string
  deletedAt: null | string
  status: 'ACTIVE' | 'INACTIVE' | null
}
