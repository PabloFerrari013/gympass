import { UsersRepository } from './../repositories/uses-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './erros/resources-not-found-error'

interface GetUserProfileUseCaseReqsuest {
  userId: string
}

interface GetUserProfileUseCaseRespnse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId
  }: GetUserProfileUseCaseReqsuest): Promise<GetUserProfileUseCaseRespnse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
