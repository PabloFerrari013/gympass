import { InvalidCredentialsError } from "./../../use-cases/erros/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAuthenticateUseCase } from "@/use-cases/factory/make-authenticate-use-case";

export async function profile(req: FastifyRequest, res: FastifyReply) {
  return res.status(200).send();
}
