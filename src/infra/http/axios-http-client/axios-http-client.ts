import {
  HttpPostClient,
  HttpPostParams,
  HttpResponse
} from '@/data/protocols/http'

import axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient<T, R> implements HttpPostClient<T, R> {
  async post (params: HttpPostParams<T>): Promise<HttpResponse<R>> {
    let httpResponse: AxiosResponse<any>
    try {
      httpResponse = await axios.post(params.url, params.body)
    } catch (error) {
      httpResponse = error.response
    }

    return {
      statusCode: httpResponse.status,
      body: httpResponse.data
    }
  }
}
