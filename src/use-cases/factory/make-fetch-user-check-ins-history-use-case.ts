import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCkeckInsHistoryUseCase() {
  const checkinsRepository = new PrismaCheckInsRepository();

  const useCase = new FetchUserCheckInsHistoryUseCase(checkinsRepository);

  return useCase;
}
