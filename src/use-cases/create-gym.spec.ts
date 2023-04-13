import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memoy-gyms-repositoy'
import { CreateGymUseCase } from './create-gym'
import { Decimal } from '@prisma/client/runtime'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

beforeEach(() => {
  gymsRepository = new InMemoryGymsRepository()
  sut = new CreateGymUseCase(gymsRepository)
})

describe('Create Gym Use Case', async () => {
  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym',
      description: null,
      phone: null,
      latitude: -20.3562179,
      longitude: -40.278214
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
