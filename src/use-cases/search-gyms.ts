import { GymsRepository } from './../repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface SeachGymsUseCaseRequest {
  query: string
  page: number
}

interface SeachGymsUseCaseResponse {
  gyms: Gym[]
}

export class SeachGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page
  }: SeachGymsUseCaseRequest): Promise<SeachGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.seachMany(query, page)

    return { gyms }
  }
}
