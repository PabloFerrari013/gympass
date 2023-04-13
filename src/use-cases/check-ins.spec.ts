import { InMemoryGymsRepository } from './../repositories/in-memory/in-memoy-gyms-repositoy'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCkeckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repositry'
import { CheckInUseCase } from './check-ins'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error'
import { MaxDistanceErrror } from './erros/max-distance-error'

let checkinsRepository: InMemoryCkeckInRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

beforeEach(async () => {
  checkinsRepository = new InMemoryCkeckInRepository()

  gymsRepository = new InMemoryGymsRepository()

  sut = new CheckInUseCase(checkinsRepository, gymsRepository)

  vi.useFakeTimers()

  await gymsRepository.create({
    id: 'gym-01',
    description: '',
    latitude: -20.3562179,
    longitude: -40.278214,
    phone: '',
    title: 'Gym'
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Ckeck ins Use Case', async () => {
  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -20.3562179,
      userLongitude: -40.278214
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -20.3562179,
      userLongitude: -40.278214
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -20.3562179,
        userLongitude: -40.278214
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in twice but in diffeent days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -20.3562179,
      userLongitude: -40.278214
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -20.3562179,
      userLongitude: -40.278214
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    gymsRepository.items.push({
      id: 'gym-02',
      description: '',
      latitude: new Decimal(-20.3445924),
      longitude: new Decimal(-40.2861772),
      phone: '',
      title: 'Gym 02'
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -20.3562179,
        userLongitude: -40.278214
      })
    ).rejects.toBeInstanceOf(MaxDistanceErrror)
  })
})
