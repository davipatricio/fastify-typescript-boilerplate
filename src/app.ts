import path from "path";
import fastify from "fastify";
import AutoLoad from "@fastify/autoload";

const app = fastify({
  logger: process.env.NODE_ENV === "development"
});

app.register(AutoLoad, {
  dir: path.join(__dirname, "routes"),
});

app.listen({ port: Number(process.env.PORT) || 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`Server listening at ${address}`);
})
