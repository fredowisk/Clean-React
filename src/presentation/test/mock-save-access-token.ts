import { SaveAccessToken } from '@/domain/usecases/save-access-token'

export class SaveAccessTokenSpy implements SaveAccessToken {
  accessToken: string

  async save (accessToken: string): Promise<void> {
    this.accessToken = accessToken
  }
}
