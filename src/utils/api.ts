import type { ApiResponse } from '@/types'

/**
 * 带路径ID参数的请求
 * @param request 请求方法
 * @param prop 参数ID的属性名，默认为id
 */
export const withPathId = (
  request: (id: number, data: any) => Promise<ApiResponse>,
  prop: string = 'id'
) => (data: any) => request(data[prop], data)
