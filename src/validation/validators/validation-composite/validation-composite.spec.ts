import { FieldValidationSpy } from '@/validation/validators/test/mock-field-validation'
import { ValidationComposite } from '@/validation/validators'

import faker from 'faker'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationSpies: FieldValidationSpy[]
}

const makeSut = (fieldName: string = faker.database.column()): SutTypes => {
  const fieldValidationSpies = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]

  const sut = new ValidationComposite(fieldValidationSpies)

  return {
    sut,
    fieldValidationSpies
  }
}

describe('Validation Composite', () => {
  test('should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { sut, fieldValidationSpies } = makeSut(fieldName)
    const errorMessage = faker.random.words()
    fieldValidationSpies[0].error = new Error(errorMessage)
    fieldValidationSpies[1].error = new Error(faker.random.words())

    const error = sut.validate(fieldName, faker.random.words())
    expect(error).toBe(errorMessage)
  })

  test('should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)

    const error = sut.validate(fieldName, faker.random.words())
    expect(error).toBeFalsy()
  })
})
