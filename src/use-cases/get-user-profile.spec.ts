import { ResourceNotFoundError } from './erros/resources-not-found-error'
import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcrypt'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository()
  sut = new GetUserProfileUseCase(usersRepository)
})

describe('Get User Profile Use Case', async () => {
  it('should be able to get user profile ', async () => {
    const password_hash = await hash('123456', 6)

    const creratedUser = await usersRepository.create({
      email: 'john@example.com',
      name: 'John',
      password_hash
    })

    const { user } = await sut.execute({
      userId: creratedUser.id
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
