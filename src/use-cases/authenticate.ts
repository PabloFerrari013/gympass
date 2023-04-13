import { InvalidCredentialsError } from './erros/invalid-credentials-error'
import { UsersRepository } from './../repositories/uses-repository'
import { compare } from 'bcrypt'
import { User } from '@prisma/client'

interface AuthenticateUseCaseReqsuest {
  email: string
  password: string
}

interface AuthenticateUseCaseRespnse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password
  }: AuthenticateUseCaseReqsuest): Promise<AuthenticateUseCaseRespnse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatches = await compare(password, user.password_hash)

    if (!doesPasswordsMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
