import { UserAlreadyExistsError } from './erros/user-already-exists-error'
import { UsersRepository } from '@/repositories/uses-repository'
import { hash } from 'bcrypt'
import { User } from '@prisma/client'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepostory: UsersRepository) {}

  async execute({
    name,
    email,
    password
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepostory.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepostory.create({
      name,
      email,
      password_hash
    })

    return { user }
  }
}
