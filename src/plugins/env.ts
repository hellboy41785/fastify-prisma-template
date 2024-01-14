import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

const envPlugin: FastifyPluginAsync = fp(async (server, options) => {
  server.register(fastifyEnv, {
    dotenv: true,
    schema: {
      type: "object",
      properties: {
        PORT: {
          type: "number",
          default: 5000,
        },
      },
      required: ["PORT"],
    },
  });
});

export default envPlugin;
