import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from './email-validation'

describe('Email Validation', () => {
  test('should return an error if email is invalid', () => {
    const sut = new EmailValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new InvalidFieldError())
  })
})
