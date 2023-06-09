import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
  waitFor
} from '@testing-library/react'

import faker from 'faker'

import { Login } from '@/presentation/pages'
import {
  ValidationStub,
  AuthenticationSpy,
  SaveAccessTokenSpy,
  Helper
} from '@/presentation/test'

import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenSpy: SaveAccessTokenSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenSpy = new SaveAccessTokenSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenSpy}
      />
    </Router>
  )

  return {
    sut,
    authenticationSpy,
    saveAccessTokenSpy
  }
}

const simulateValidSubmit = async (
  sut: RenderResult,
  email?: string,
  password?: string
): Promise<void> => {
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Login page', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    Helper.testIfButtonIsDisabled(sut, 'submit', true)
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
  })

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const fieldName = 'email'

    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, fieldName)

    Helper.testStatusForField(sut, fieldName, validationError)
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const fieldName = 'password'

    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, fieldName)

    Helper.testStatusForField(sut, fieldName, validationError)
  })

  test('should show valid password state if Validation succeeds', () => {
    const fieldName = 'password'

    const { sut } = makeSut()

    Helper.populateField(sut, fieldName)

    Helper.testStatusForField(sut, fieldName)
  })

  test('should show valid email state if Validation succeeds', () => {
    const fieldName = 'email'

    const { sut } = makeSut()

    Helper.populateField(sut, fieldName)

    Helper.testStatusForField(sut, fieldName)
  })

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')

    Helper.testIfButtonIsDisabled(sut, 'submit', false)
  })

  test('should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    Helper.testIfElementExists(sut, 'spinner')
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()

    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    await simulateValidSubmit(sut)

    Helper.testChildCount(sut, 'error-wrap', 0)
  })

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await simulateValidSubmit(sut)

    Helper.testElementTextContent(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenSpy } = makeSut()

    await simulateValidSubmit(sut)

    expect(saveAccessTokenSpy.accessToken).toBe(
      authenticationSpy.account.accessToken
    )
    Helper.testHistoryContext(history, 1, '/')
  })

  test('should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenSpy } = makeSut()
    const error = new InvalidCredentialsError()

    jest.spyOn(saveAccessTokenSpy, 'save').mockRejectedValueOnce(error)

    await simulateValidSubmit(sut)

    Helper.testElementTextContent(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('should go to signup page', () => {
    const { sut } = makeSut()

    const register = sut.getByTestId('register')
    fireEvent.click(register)

    Helper.testHistoryContext(history, 2, '/signup')
  })
})
