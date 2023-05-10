export enum HttpStatusCode {
  ok = 200,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
}

export type HttpResponse<T> = {
  statusCode: HttpStatusCode
  body?: T
}