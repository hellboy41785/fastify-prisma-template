import Fastify, { FastifyInstance } from "fastify";
import prismaPlugin from "./plugins/prisima";
import envPlugin from "./plugins/env";
import { userRoutes } from "routes/users";

const buildApp = () => {
  const app: FastifyInstance = Fastify({
    logger: true,
  });

  app.register(prismaPlugin);
  app.register(userRoutes);
  app.register(envPlugin);
  return app;
};

export { buildApp };
