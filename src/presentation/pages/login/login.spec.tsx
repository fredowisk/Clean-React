import React from 'react'
import {
  RenderResult,
  cleanup,
  fireEvent,
  render
} from '@testing-library/react'

import Login from './login'
import { ValidationStub } from '@/presentation/test'

import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.random.words()
  const sut = render(<Login validation={validationStub} />)

  return {
    sut,
    validationStub
  }
}

describe('Login page', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const {
      sut: { getByTestId },
      validationStub
    } = makeSut()

    const errorWrap = getByTestId('error-wrap')
    const submitButton = getByTestId('submit') as HTMLButtonElement
    const emailStatus = getByTestId('email-status')
    const passwordStatus = getByTestId('password-status')

    expect(errorWrap.childElementCount).toBe(0)
    expect(submitButton.disabled).toBe(true)
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('should show email error if Validation fails', () => {
    const { sut, validationStub } = makeSut()

    const emailInput = sut.getByTestId('email')

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('should show password error if Validation fails', () => {
    const { sut, validationStub } = makeSut()

    const passwordInput = sut.getByTestId('password')

    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() }
    })

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('should show valid password state if Validation succeeds', () => {
    const { sut, validationStub } = makeSut()
    validationStub.errorMessage = null
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('🟢')
  })
})
