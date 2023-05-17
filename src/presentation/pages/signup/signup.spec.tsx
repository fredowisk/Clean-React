import React from 'react'
import {
  RenderResult,
  render,
  cleanup,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'

import SignUp from './signup'
import {
  Helper,
  ValidationStub,
  AddAccountSpy,
  SaveAccessTokenSpy
} from '@/presentation/test'
import { EmailInUseError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  saveAccessTokenSpy: SaveAccessTokenSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const saveAccessTokenSpy = new SaveAccessTokenSpy()
  const sut = render(
    <Router history={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenSpy}
      />
    </Router>
  )

  return {
    sut,
    addAccountSpy,
    saveAccessTokenSpy
  }
}

const simulateValidSubmit = async (
  sut: RenderResult,
  name: string = faker.random.word(),
  email?: string,
  password?: string,
  passwordConfirmation: string = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, 'name', name)
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  Helper.populateField(sut, 'passwordConfirmation', passwordConfirmation)

  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('should start with initial state ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testIfButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', validationError)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const fieldName = 'name'
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, fieldName, faker.random.word())
    Helper.testStatusForField(sut, fieldName, validationError)
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

  test('should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    const fieldName = 'passwordConfirmation'
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, fieldName, faker.internet.password())
    Helper.testStatusForField(sut, fieldName, validationError)
  })

  test('should show valid name state if Validation succeeds', () => {
    const fieldName = 'name'
    const { sut } = makeSut()
    Helper.populateField(sut, fieldName, faker.random.word())
    Helper.testStatusForField(sut, fieldName)
  })

  test('should show valid email state if Validation succeeds', () => {
    const fieldName = 'email'
    const { sut } = makeSut()
    Helper.populateField(sut, fieldName)
    Helper.testStatusForField(sut, fieldName)
  })

  test('should show valid password state if Validation succeeds', () => {
    const fieldName = 'password'
    const { sut } = makeSut()
    Helper.populateField(sut, fieldName)
    Helper.testStatusForField(sut, fieldName)
  })

  test('should show valid passwordConfirmation state if Validation succeeds', () => {
    const fieldName = 'passwordConfirmation'
    const { sut } = makeSut()
    Helper.populateField(sut, fieldName, faker.internet.password())
    Helper.testStatusForField(sut, fieldName)
  })

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name', faker.random.word())
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(
      sut,
      'passwordConfirmation',
      faker.internet.password()
    )
    Helper.testIfButtonIsDisabled(sut, 'submit', false)
  })

  test('should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    Helper.testIfElementExists(sut, 'spinner')
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()

    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(sut, name, email, password, password)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = makeSut()

    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut, addAccountSpy } = makeSut({ validationError })
    await simulateValidSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    Helper.testElementTextContent(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('should call SaveAccessToken on success', async () => {
    const { sut, addAccountSpy, saveAccessTokenSpy } = makeSut()

    await simulateValidSubmit(sut)

    expect(saveAccessTokenSpy.accessToken).toBe(
      addAccountSpy.account.accessToken
    )
    Helper.testHistoryContext(history, 1, '/')
  })

  test('should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenSpy } = makeSut()
    const error = new EmailInUseError()

    jest.spyOn(saveAccessTokenSpy, 'save').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    Helper.testElementTextContent(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('should go to login page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('register')
    fireEvent.click(register)
    Helper.testHistoryContext(history, 2, '/login')
  })
})
