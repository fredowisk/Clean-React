import { AxiosHttpClient } from './axios-http-client'

import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

import { mockAxios } from '@/infra/test'

import { mockPostRequest } from '@/data/test'

import axios from 'axios'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient<AuthenticationParams, AccountModel>
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient<AuthenticationParams, AccountModel>()
  const mockedAxios = mockAxios()
  return { sut, mockedAxios }
}

describe('Axios Http Client', () => {
  test('should call axios with correct values', async () => {
    const request = mockPostRequest()

    const { sut, mockedAxios } = makeSut()

    await sut.post(request)

    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('should return the correct statusCode and body', () => {
    const { sut, mockedAxios } = makeSut()

    const promise = sut.post(mockPostRequest())

    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
