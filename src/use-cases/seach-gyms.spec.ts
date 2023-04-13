import { GymsRepository } from './../repositories/gyms-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memoy-gyms-repositoy'
import { SeachGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SeachGymsUseCase

beforeEach(async () => {
  gymsRepository = new InMemoryGymsRepository()

  sut = new SeachGymsUseCase(gymsRepository)
})

describe('Search Gyms Use Case', async () => {
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Gym 01',
      description: '',
      phone: '',
      latitude: -20.3562179,
      longitude: -40.278214
    })

    await gymsRepository.create({
      title: 'Gym 02',
      description: '',
      phone: '',
      latitude: -20.3562179,
      longitude: -40.278214
    })

    await gymsRepository.create({
      title: 'this cannot be found by search',
      description: '',
      phone: '',
      latitude: -20.3562179,
      longitude: -40.278214
    })

    const { gyms } = await sut.execute({
      page: 1,
      query: 'Gym'
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 01' }),
      expect.objectContaining({ title: 'Gym 02' })
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym-${i}`,
        description: '',
        phone: '',
        latitude: -20.3562179,
        longitude: -40.278214
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym-21' }),
      expect.objectContaining({ title: 'Gym-22' })
    ])
  })
})
