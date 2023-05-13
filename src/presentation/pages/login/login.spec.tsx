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
import 'jest-localstorage-mock'

import Login from './login'

import { ValidationStub, AuthenticationSpy } from '@/presentation/test'

import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )

  return {
    sut,
    authenticationSpy
  }
}

const simulateValidSubmit = async (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const populateEmailField = (
  { getByTestId }: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  const emailInput = getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (
  { getByTestId }: RenderResult,
  password = faker.internet.password()
): void => {
  const passwordInput = getByTestId('password')
  fireEvent.input(passwordInput, {
    target: { value: password }
  })
}

const testStatusForField = (
  { getByTestId }: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

const testErrorWrapChildCount = (
  { getByTestId }: RenderResult,
  count: number
): void => {
  const errorWrap = getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testIfElementExists = (
  { getByTestId }: RenderResult,
  fieldName: string
): void => {
  const element = getByTestId(fieldName)
  expect(element).toBeTruthy()
}

const testElementTextContent = (
  { getByTestId }: RenderResult,
  fieldName: string,
  textContent: string
): void => {
  const element = getByTestId(fieldName)
  expect(element.textContent).toBe(textContent)
}

const testIfButtonIsDisabled = (
  { getByTestId }: RenderResult,
  isDisabled: boolean
): void => {
  const button = getByTestId('submit') as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testHistoryContext = (length: number, pathname: string): void => {
  expect(history.length).toBe(length)
  expect(history.location.pathname).toBe(pathname)
}

describe('Login page', () => {
  afterEach(cleanup)

  beforeEach(() => {
    localStorage.clear()
  })

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    testIfButtonIsDisabled(sut, true)
    testErrorWrapChildCount(sut, 0)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
  })

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    populateEmailField(sut)

    testStatusForField(sut, 'email', validationError)
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    populatePasswordField(sut)

    testStatusForField(sut, 'password', validationError)
  })

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()

    populatePasswordField(sut)

    testStatusForField(sut, 'password')
  })

  test('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()

    populateEmailField(sut)

    testStatusForField(sut, 'email')
  })

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    testIfButtonIsDisabled(sut, false)
  })

  test('should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    testIfElementExists(sut, 'spinner')
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

    testErrorWrapChildCount(sut, 0)
  })

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await simulateValidSubmit(sut)

    testElementTextContent(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)
  })

  test('should add accessToken to localStorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()

    await simulateValidSubmit(sut)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken',
      authenticationSpy.account.accessToken
    )
    testHistoryContext(1, '/')
  })

  test('should go to signup page', () => {
    const { sut } = makeSut()

    const register = sut.getByTestId('register')
    fireEvent.click(register)

    testHistoryContext(2, '/signup')
  })
})
