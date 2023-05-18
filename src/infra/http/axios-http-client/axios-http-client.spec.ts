import { AxiosHttpClient } from './axios-http-client'

import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

import { mockAxios, mockHttpResponse } from '@/infra/test'

import { mockPostRequest } from '@/data/test'

import axios from 'axios'
import { mockGetRequest } from '@/data/test/mock-http-get'
import { SurveyModel } from '@/domain/models/survey-model'

jest.mock('axios')

type SutPostTypes = {
  sut: AxiosHttpClient<AuthenticationParams, AccountModel>
  mockedAxios: jest.Mocked<typeof axios>
}

type SutGetTypes = {
  sut: AxiosHttpClient<null, SurveyModel[]>
  mockedAxios: jest.Mocked<typeof axios>
}

const makePostSut = (): SutPostTypes => {
  const sut = new AxiosHttpClient<AuthenticationParams, AccountModel>()
  const mockedAxios = mockAxios()
  return { sut, mockedAxios }
}

const makeGetSut = (): SutGetTypes => {
  const sut = new AxiosHttpClient<null, SurveyModel[]>()
  const mockedAxios = mockAxios()
  return { sut, mockedAxios }
}

describe('Axios Http Client', () => {
  describe('post', () => {
    test('should call post with correct values', async () => {
      const request = mockPostRequest()

      const { sut, mockedAxios } = makePostSut()

      await sut.post(request)

      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })

    test('should return the correct statusCode and body', async () => {
      const { sut, mockedAxios } = makePostSut()

      const httpResponse = await sut.post(mockPostRequest())
      const axiosResponse = await mockedAxios.post.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('should return the correct error on failure', () => {
      const { sut, mockedAxios } = makePostSut()
      mockedAxios.post.mockRejectedValueOnce({
        response: mockHttpResponse()
      })

      const promise = sut.post(mockPostRequest())

      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })

  describe('get', () => {
    test('should call get with correct values', async () => {
      const request = mockGetRequest()
      const { sut, mockedAxios } = makeGetSut()
      await sut.get(request)
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url)
    })

    test('should return the correct statusCode and body', async () => {
      const { sut, mockedAxios } = makeGetSut()

      const httpResponse = await sut.get(mockPostRequest())
      const axiosResponse = await mockedAxios.get.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('should return the correct error on failure', () => {
      const { sut, mockedAxios } = makeGetSut()

      mockedAxios.get.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = sut.get(mockPostRequest())

      expect(promise).toEqual(mockedAxios.get.mock.results[0].value)
    })
  })
})
