import { ResourceNotFoundError } from './erros/resources-not-found-error'
import { GymsRepository } from '../repositories/gyms-repository'
import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-reposiitory'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coodinates'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error'
import { MaxDistanceErrror } from './erros/max-distance-error'

interface CheckInUseCaseReqsuest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseRespnse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private chekinsRepository: CheckInsRepository,
    private gymsRepositoy: GymsRepository
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude
  }: CheckInUseCaseReqsuest): Promise<CheckInUseCaseRespnse> {
    const gym = await this.gymsRepositoy.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber()
      }
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistanceErrror()

    const checkInSomeDay = await this.chekinsRepository.findByUserId(
      userId,
      new Date()
    )

    if (checkInSomeDay) throw new MaxNumberOfCheckInsError()

    const checkIn = await this.chekinsRepository.create({
      gym_id: gymId,
      user_id: userId
    })

    return { checkIn }
  }
}
