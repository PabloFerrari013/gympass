import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post("/users").send({
    name: "Jhon Doe",
    email: "jhon@example.com",
    password: "123abc",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "jhon@example.com",
    password: "123abc",
  });

  const { token } = authResponse.body;

  return { token };
}
