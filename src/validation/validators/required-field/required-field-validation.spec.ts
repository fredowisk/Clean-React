import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from '@/validation/validators'

import faker from 'faker'

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation(faker.database.column())

describe('Required Field Validation', () => {
  test('should return error if field is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })

  test('should return falsy if field is not empty', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toBeFalsy()
  })
})
