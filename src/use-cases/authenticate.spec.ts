import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcrypt'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository()
  sut = new AuthenticateUseCase(usersRepository)
})

describe('Authenticate Use Case', async () => {
  it('should be able to athenticate', async () => {
    const password_hash = await hash('123456', 6)

    await usersRepository.create({
      email: 'john@example.com',
      name: 'John',
      password_hash
    })

    const { user } = await sut.execute({
      email: 'john@example.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to athenticate with wrong e-mail', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to athenticate with wrong password', async () => {
    const password_hash = await hash('123456', 6)

    await usersRepository.create({
      email: 'john@example.com',
      name: 'John',
      password_hash
    })

    await expect(() =>
      sut.execute({
        email: 'john@example.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
