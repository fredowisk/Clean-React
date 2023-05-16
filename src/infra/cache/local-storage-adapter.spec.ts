import 'jest-localstorage-mock'
import faker from 'faker'
import { LocalStorageAdapter } from './local-storage-adapter'

describe('Local Storage Adapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage with correct values', async () => {
    const sut = new LocalStorageAdapter()
    const key = faker.database.column()
    const value = faker.random.word()
    await sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
  })
})
