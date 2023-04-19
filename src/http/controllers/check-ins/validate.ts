import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeValidateCheckInUseCase } from "@/use-cases/factory/make-validate-check-in-use-case";
import { LateCheckInValidateError } from "@/use-cases/erros/late-check-in-validate-error";

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validateCheckInsParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  try {
    const { checkInId } = validateCheckInsParamsSchema.parse(req.params);

    const validateCheckInUseCase = makeValidateCheckInUseCase();

    await validateCheckInUseCase.execute({
      checkInId,
    });

    return res.status(204).send();
  } catch (error) {
    if (error instanceof LateCheckInValidateError) {
      return res
        .status(406)
        .send("Check in can only be validated after 20 minutes");
    }

    return res.status(500).send(error);
  }
}
