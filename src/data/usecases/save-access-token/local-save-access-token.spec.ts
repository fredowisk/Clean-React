import { SetStorageSpy } from '@/data/test/mock-storage'
import { LocalSaveAccessToken } from './local-save-access-token'

import faker from 'faker'

describe('Local Storage Access Token', () => {
  test('should call SetStorage with correct value', async () => {
    const setStorage = new SetStorageSpy()
    const sut = new LocalSaveAccessToken(setStorage)
    const accessToken = faker.random.uuid()
    await sut.save(accessToken)
    expect(setStorage.key).toBe('accessToken')
    expect(setStorage.value).toBe(accessToken)
  })
})
