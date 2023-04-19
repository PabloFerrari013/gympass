import fastify from "fastify";
import fastfyJwt from "@fastify/jwt";
import fastfyCookie from "@fastify/cookie";
import { ZodError } from "zod";
import { env } from "./env";
import { usersRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastfyCookie);
app.register(fastfyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, req, res) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  if (env.NODE_ENV === "development") {
    console.log(error);
  }

  return res.status(500).send({ message: "Internal server error" });
});
