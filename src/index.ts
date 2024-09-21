import Fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import v1Routes from "./routes/v1/v1_routes";
import middie from "@fastify/middie";
import prismaPlugin from "./plugins/prisma_plugin";
import firebasePlugin from "./plugins/firebase_plugin";
import Env from "./env";

const build = async () => {
  try {
    console.log("Starting server...");
    const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
      Fastify({
        logger: true,
      });

    //env
    await server.register(fastifyEnv, {
      dotenv: true,
      confKey: "config",
      schema: {
        type: "object",
        properties: {
          PORT: {
            type: "number",
          },
          DATABASE_URL: {
            type: "string",
          },
          JWT_SECRET: {
            type: "string",
          },
          GOOGLE_GEMINI_API_KEY: {
            type: "string",
          },
          FIREBASE_PROJECT_ID: {
            type: "string",
          },
          FIREBASE_CLIENT_EMAIL: {
            type: "string",
          },
          FIREBASE_PRIVATE_KEY: {
            type: "string",
          },
        },
        required: ["PORT", "DATABASE_URL", "JWT_SECRET"],
      },
    });

    //cors
    server.register(cors, {
      origin: "*",
    });

    //helmet
    server.register(helmet);

    //swagger
    server.register(swagger, {
      openapi: {
        openapi: "3.0.0",
        info: {
          title: "StudyBean API",
          description: "StudyBean API",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost:3000",
            description: "Local server",
          },
        ],
        components: {
          securitySchemes: {
            apiKey: {
              type: "apiKey",
              name: "apiKey",
              in: "header",
            },
          },
        },
      },
    });

    //swagger-ui
    server.register(swaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });

    server.register(middie);

    const env = server.getEnvs<Env>();

    server.register(firebasePlugin, {
      credential: {
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY
          ? env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined,
      },
    });

    server.register(prismaPlugin);

    //routes
    server.register(v1Routes, {
      prefix: "/api/v1",
    });

    return server;
  } catch (err) {
    console.log("Error building server: ", err);
    process.exit(1);
  }
};

const start = async (server: FastifyInstance) => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

build()
  .then((server) => start(server))
  .catch((err) => {
    console.log("Error starting server: ", err);
  });
