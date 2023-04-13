import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCkeckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repositry'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkinsRepository: InMemoryCkeckInRepository
let sut: FetchUserCheckInsHistoryUseCase

beforeEach(async () => {
  checkinsRepository = new InMemoryCkeckInRepository()

  sut = new FetchUserCheckInsHistoryUseCase(checkinsRepository)
})

describe('Fetch User Ckeck-ins History Use Case', async () => {
  it('should be able to fetch check-in history', async () => {
    await checkinsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01'
    })

    await checkinsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02'
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' })
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkinsRepository.create({
        user_id: `user-01`,
        gym_id: `gym-${i}`
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' })
    ])
  })
})
