import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'

import faker from 'faker'

const MIN_LENGTH = 5

const makeSut = (): MinLengthValidation =>
  new MinLengthValidation(faker.database.column(), MIN_LENGTH)

describe('Min Length Validation', () => {
  test('should return error if value is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(MIN_LENGTH - 1))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if value is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(MIN_LENGTH + 1))
    expect(error).toBeFalsy()
  })
})
