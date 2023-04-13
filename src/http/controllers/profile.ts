import { InvalidCredentialsError } from "./../../use-cases/erros/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "@/use-cases/factory/make-get-user-profile-use-case";

export async function profile(req: FastifyRequest, res: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({
    userId: req.user.sub,
  });
  return res.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
