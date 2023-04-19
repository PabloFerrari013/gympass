import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  // const user = prisma.user.create({
  //   data: {
  //     name: "admin",
  //     email: "admin@example.com",
  //     password_hash: await hash("12345678", 6),
  //     role: isAdmin ? "ADMIN" : "MEMBER",
  //   },
  // });

  const user = await prisma.user.create({
    data: {
      name: "admin",
      email: "jhon@example.com",
      password_hash: await hash("123abc", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "jhon@example.com",
    password: "123abc",
  });

  const { token } = authResponse.body;

  return { token };
}
