import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from '@/validation/validators'

import faker from 'faker'

const makeSut = (): EmailValidation =>
  new EmailValidation(faker.database.column())

describe('Email Validation', () => {
  test('should return an error if email is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if email is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })

  test('should return falsy if email is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toBeFalsy()
  })
})
