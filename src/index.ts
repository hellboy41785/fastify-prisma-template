import { buildApp } from "./app";
import cors from "@fastify/cors";
import 'module-alias/register';

const start = async () => {
  const app = buildApp();
  try {
    await app.register(cors);
    app.get("/", (_, rp) => {
      rp.status(200).send("Welcome to  api! 🎉");
    });

    app.get("*", (_request, reply) => {
      reply.status(404).send({
        message: "",
        error: "page not found",
      });
    });
    app.listen({ port: Number(process.env.PORT), host: "0.0.0.0" }, (err, address) => {
      if (err) throw err;
      console.log(`Server listening at ${address}`);
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
