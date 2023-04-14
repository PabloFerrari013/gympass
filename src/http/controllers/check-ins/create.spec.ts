import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { randomUUID } from "crypto";

describe("Create Check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gymResponse = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym",
        latitude: -20.3562179,
        longitude: -40.278214,
        description: null,
        phone: null,
      });

    const response = await request(app.server)
      .post(`/gyms/${gymResponse.body.gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -20.3562179,
        longitude: -40.278214,
      });

    expect(response.statusCode).toEqual(201);
  });
});
