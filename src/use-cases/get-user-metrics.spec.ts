import { GetUserMetricsUseCase } from './get-user-metrics'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCkeckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repositry'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkinsRepository: InMemoryCkeckInRepository
let sut: GetUserMetricsUseCase

beforeEach(async () => {
  checkinsRepository = new InMemoryCkeckInRepository()

  sut = new GetUserMetricsUseCase(checkinsRepository)
})

describe('Get User Metrics Use Case', async () => {
  it('should be able to check-ins count from metrics', async () => {
    await checkinsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01'
    })

    await checkinsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01'
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01'
    })

    expect(checkInsCount).toEqual(2)
  })
})
