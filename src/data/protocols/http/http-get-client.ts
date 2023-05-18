import { HttpResponse } from './http-response'

export type HttpGetParams = {
  url: string
}

export interface HttpGetClient<R> {
  get: (params: HttpGetParams) => Promise<HttpResponse<R>>
}
