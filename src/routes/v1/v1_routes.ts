import { FastifyInstance } from "fastify";
import userRoutes from "./users/user_routes";
import subjectRoutes from "./subjects/subject_routes";
import roadmapRoutes from "./roadmaps/roadmap_routes";

async function v1Routes(fastify: FastifyInstance, options: Object) {
  fastify.register(userRoutes, { prefix: "/users" });
  fastify.register(subjectRoutes, { prefix: "/subjects" });
  fastify.register(roadmapRoutes, { prefix: "/roadmaps" });
}

export default v1Routes;
