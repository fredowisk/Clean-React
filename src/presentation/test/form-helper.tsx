import { RenderResult, fireEvent } from '@testing-library/react'
import { MemoryHistory } from 'history'
import faker from 'faker'

export const testChildCount = (
  { getByTestId }: RenderResult,
  fieldName: string,
  count: number
): void => {
  const element = getByTestId(fieldName)
  expect(element.childElementCount).toBe(count)
}

export const testIfButtonIsDisabled = (
  { getByTestId }: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testStatusForField = (
  { getByTestId }: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (
  { getByTestId }: RenderResult,
  fieldName: string,
  value: string = faker.internet[fieldName]()
): void => {
  const input = getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

export const testIfElementExists = (
  { getByTestId }: RenderResult,
  fieldName: string
): void => {
  const element = getByTestId(fieldName)
  expect(element).toBeTruthy()
}

export const testElementTextContent = (
  { getByTestId }: RenderResult,
  fieldName: string,
  textContent: string
): void => {
  const element = getByTestId(fieldName)
  expect(element.textContent).toBe(textContent)
}

export const testHistoryContext = (
  history: MemoryHistory,
  length: number,
  pathname: string
): void => {
  expect(history.length).toBe(length)
  expect(history.location.pathname).toBe(pathname)
}
