import { SeachGymsUseCase } from "../search-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeSeachGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();

  const useCase = new SeachGymsUseCase(gymsRepository);

  return useCase;
}
