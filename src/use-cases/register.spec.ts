import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository()
  sut = new RegisterUseCase(usersRepository)
})

describe('Register Use Case', async () => {
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'john',
      email: 'john@example.com',
      password: 'password'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'john',
      email: 'john@example.com',
      password: 'password'
    })

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same e-mail twice', async () => {
    const email = 'johndoe@gmail.com'

    await sut.execute({
      name: 'john',
      email,
      password: 'password'
    })

    await expect(async () => {
      await sut.execute({
        name: 'john',
        email,
        password: 'password'
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
