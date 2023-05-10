import { HttpPostParams } from '@/data/protocols/http'
import { AxiosHttpClient } from './axios-http-client'
import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

import axios from 'axios'
import faker from 'faker'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockedAxiosResult = {
  data: faker.random.objectElement(),
  status: faker.random.number()
}

mockedAxios.post.mockResolvedValue(mockedAxiosResult)

const makeSut = (): AxiosHttpClient<AuthenticationParams, AccountModel> => {
  return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

describe('Axios Http Client', () => {
  test('should call axios with correct values', async () => {
    const request = mockPostRequest()

    await makeSut().post(request)

    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('should return the correct statusCode and body', async () => {
    const sut = makeSut()
    const httpResponse = await sut.post(mockPostRequest())
    expect(httpResponse).toEqual({
      statusCode: mockedAxiosResult.status,
      body: mockedAxiosResult.data
    })
  })
})
