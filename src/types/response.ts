import type { AxiosError, AxiosResponse } from 'axios'

export type ApiResponse<T = any> = AxiosResponse<ResData<T>>
export type ApiError<T = any> = AxiosError<ResData<T>>

export interface ResData<T> {
  readonly code: number
  readonly message: string
  readonly data: T
}

export interface Pagination<T> {
  readonly records: T[]
  readonly total: number
  readonly current: number
  readonly pages: number
  readonly size: number
  readonly keyword?: string
  readonly orderBy?: { [C in keyof T]: 'asc' | 'desc' }
  readonly filters?: { [C in keyof T]: T[C][] }
}
