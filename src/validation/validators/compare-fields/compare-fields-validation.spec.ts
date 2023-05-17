import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

import faker from 'faker'

const makeSut = (
  field: string,
  fieldToCompare: string
): CompareFieldsValidation =>
  new CompareFieldsValidation(field, fieldToCompare)

describe('Compare Fields Validation', () => {
  test('should return error if compare is invalid', () => {
    const field = 'password'
    const fieldToCompare = 'passwordConfirmation'
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({
      password: field,
      passwordConfirmation: fieldToCompare
    })
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if compare is valid', () => {
    const field = 'password'
    const fieldToCompare = 'passwordConfirmation'
    const value = faker.random.word()
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({ field: value, fieldToCompare: value })
    expect(error).toBeFalsy()
  })
})
