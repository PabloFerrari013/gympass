import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/use-cases/erros/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factory/make-register-use-case";

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerUserBodySchema.parse(req.body);

  try {
    const registerUserUseCase = makeRegisterUseCase();

    await registerUserUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return res.status(409).send();
    }

    throw error;
  }

  return res.status(201).send();
}
