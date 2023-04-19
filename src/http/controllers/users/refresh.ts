import { InvalidCredentialsError } from "../../../use-cases/erros/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAuthenticateUseCase } from "@/use-cases/factory/make-authenticate-use-case";

export async function refresh(req: FastifyRequest, res: FastifyReply) {
  await req.jwtVerify({
    onlyCookie: true,
  });

  const token = await res.jwtSign(
    {
      role: req.user.role,
    },
    { sign: { sub: req.user.sub } }
  );

  const refreshToken = await res.jwtSign(
    {
      role: req.user.role,
    },
    {
      sign: {
        sub: req.user.sub,
        expiresIn: "7d",
      },
    }
  );

  return res
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token });
}
