import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'

export function makeAxiosHttpClient<T, R> (): AxiosHttpClient<T, R> {
  return new AxiosHttpClient<T, R>()
}
