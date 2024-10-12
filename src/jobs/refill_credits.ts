import { FastifyInstance } from "fastify";

async function refillCredits(fastify: FastifyInstance) {
  try {
    await fastify.db.user.updateMany({
      data: {
        credits: 10
      }
    });
  } catch (e) {
    fastify.log.error(e)
  }
}

export default refillCredits;
