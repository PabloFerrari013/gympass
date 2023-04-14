import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "@/use-cases/factory/make-check-in-use-case";
import { MaxNumberOfCheckInsError } from "@/use-cases/erros/max-number-of-check-ins-error";

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInsBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  try {
    const { latitude, longitude } = createCheckInsBodySchema.parse(req.body);

    const { gymId } = createCheckInsParamsSchema.parse(req.params);

    const crateCheckInUseCase = makeCheckInUseCase();

    const { checkIn } = await crateCheckInUseCase.execute({
      gymId,
      userId: req.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return res.status(201).send({ checkIn });
  } catch (error) {
    if (error instanceof MaxNumberOfCheckInsError) {
      return res
        .status(409)
        .send("It is not possible to check in more than once in a day");
    }

    console.log(error);
    res.status(500).send();
  }
}
