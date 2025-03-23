export interface Pageable {
  current?: number
  size?: number
}

export interface Searchable {
  keyword?: string
}

export interface Sortable<T> {
  sort?: keyof T
  order?: 'asc' | 'desc'
}

export type Filterable<T> = {
  filters?: {
    [propName in keyof T]?: T[propName][]
  }
}

export type ApiParams<T = object | unknown> = (
  Pageable & Searchable & Sortable<T> & Filterable<T>) | Record<string, unknown>
