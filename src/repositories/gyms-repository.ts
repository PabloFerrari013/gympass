import { Prisma, Gym } from '@prisma/client'

export interface FindManyNeabyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  seachMany(query: string, page: number): Promise<Gym[]>
  findManyNeaby(params: FindManyNeabyParams): Promise<Gym[]>
}
