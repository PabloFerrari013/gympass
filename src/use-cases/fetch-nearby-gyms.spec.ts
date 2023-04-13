import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { GymsRepository } from './../repositories/gyms-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memoy-gyms-repositoy'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

beforeEach(async () => {
  gymsRepository = new InMemoryGymsRepository()

  sut = new FetchNearbyGymsUseCase(gymsRepository)
})

describe('Fetch Neaby Gyms Use Case', async () => {
  it('should be able to fetch neaby gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: '',
      phone: '',
      latitude: -20.3562179,
      longitude: -40.278214
    })

    await gymsRepository.create({
      title: 'Far gym',
      description: '',
      phone: '',
      latitude: -23.3020912,
      longitude: -46.5824642
    })

    const { gyms } = await sut.execute({
      userLatitude: -20.3562179,
      userLongitude: -40.278214
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })])
  })

  // it('should be able to fetch paginated gyms search', async () => {
  //   for (let i = 1; i <= 22; i++) {
  //     await gymsRepository.create({
  //       title: `Gym-${i}`,
  //       description: '',
  //       phone: '',
  //       latitude: -20.3562179,
  //       longitude: -40.278214
  //     })
  //   }

  //   const { gyms } = await sut.execute({
  //     query: 'Gym',
  //     page: 2
  //   })

  //   expect(gyms).toHaveLength(2)
  //   expect(gyms).toEqual([
  //     expect.objectContaining({ title: 'Gym-21' }),
  //     expect.objectContaining({ title: 'Gym-22' })
  //   ])
  // })
})
