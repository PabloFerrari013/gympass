import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/use-cases/erros/user-already-exists-error";
import { makeCreateGymUseCase } from "@/use-cases/factory/make-create-gym-use-case";
import { makeSeachGymsUseCase } from "@/use-cases/factory/make-search-gym-use-case";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factory/make-fetch-nearby-use-case";

export async function nearby(req: FastifyRequest, res: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query);

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return res.status(200).send({ gyms });
}
