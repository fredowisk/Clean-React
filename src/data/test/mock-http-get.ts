import { HttpGetParams } from '@/data/protocols/http'

import faker from 'faker'

export const mockGetRequest = (): HttpGetParams => ({
  url: faker.internet.url()
})
