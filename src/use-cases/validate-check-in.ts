import { ResourceNotFoundError } from './erros/resources-not-found-error'
import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-reposiitory'
import dayjs from 'dayjs'
import { LateCheckInValidateError } from './erros/late-check-in-validate-error'

interface ValidateCheckInUseCaseReqsuest {
  checkInId: string
}

interface ValidateCheckInUseCaseRespnse {
  checkIn: CheckIn | null
}

export class ValidateCheckInUseCase {
  constructor(private chekinsRepository: CheckInsRepository) {}

  async execute({
    checkInId
  }: ValidateCheckInUseCaseReqsuest): Promise<ValidateCheckInUseCaseRespnse> {
    const checkIn = await this.chekinsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    )

    if (distanceInMinutesFromCheckInCreation > 20)
      throw new LateCheckInValidateError()

    checkIn.validated_at = new Date()

    await this.chekinsRepository.save(checkIn)

    return { checkIn }
  }
}
