import {
  HttpGetClient,
  HttpGetParams,
  HttpPostClient,
  HttpPostParams,
  HttpResponse
} from '@/data/protocols/http'

import axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient<T, R>
implements HttpPostClient<T, R>, HttpGetClient<R> {
  async post (params: HttpPostParams<T>): Promise<HttpResponse<R>> {
    let httpResponse: AxiosResponse<any>
    try {
      httpResponse = await axios.post(params.url, params.body)
    } catch (error) {
      httpResponse = error.response
    }

    return this.adapt(httpResponse)
  }

  async get (params: HttpGetParams): Promise<HttpResponse<R>> {
    let httpResponse: AxiosResponse<any>
    try {
      httpResponse = await axios.get(params.url)
    } catch (error) {
      httpResponse = error.response
    }

    return this.adapt(httpResponse)
  }

  private adapt (httpResponse: AxiosResponse): HttpResponse<any> {
    return {
      statusCode: httpResponse.status,
      body: httpResponse.data
    }
  }
}
