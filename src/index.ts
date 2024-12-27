import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import helmet from "@fastify/helmet";
import middie from "@fastify/middie";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { CronJob } from "cron";
import dayjs from "dayjs";
import Fastify, { FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import Env from "./env";
import refillCredits from "./jobs/refill_credits";
import firebasePlugin from "./plugins/firebase_plugin";
import prismaPlugin from "./plugins/prisma_plugin";
import s3_plugin from "./plugins/s3_plugin";
import v1Routes from "./routes/v1/v1_routes";
import JwtService from "./services/jwt.service";

declare module "fastify" {
  interface FastifyRequest {
    jwtService: JwtService;
  }
}

const build = async () => {
  try {
    console.log("Starting server...", process.env.NODE_ENV);
    const app: FastifyInstance<Server, IncomingMessage, ServerResponse> =
      Fastify({
        logger: true,
      });

    //env
    await app.register(fastifyEnv, {
      dotenv: true,
      confKey: "config",
      schema: {
        type: "object",
        properties: {
          NODE_ENV: {
            type: "string",
          },
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
          S3_ACCESS_KEY: {
            type: "string",
          },
          S3_SECRET_KEY: {
            type: "string",
          },
          S3_REGION: {
            type: "string",
          },
          S3_BUCKET_NAME: {
            type: "string",
          },
          S3_CLOUDFRONT_DOMAIN: {
            type: "string",
          },
        },
        required: [
          "NODE_ENV",
          "PORT",
          "DATABASE_URL",
          "JWT_SECRET",
          "GOOGLE_GEMINI_API_KEY",
          "FIREBASE_PROJECT_ID",
          "FIREBASE_CLIENT_EMAIL",
          "FIREBASE_PRIVATE_KEY",
          "S3_ACCESS_KEY",
          "S3_SECRET_KEY",
          "S3_REGION",
          "S3_BUCKET_NAME",
          "S3_CLOUDFRONT_DOMAIN",
        ],
      },
    });

    //cors
    app.register(cors, {
      origin: "*",
    });

    //helmet
    app.register(helmet);

    //swagger
    app.register(swagger, {
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
    app.register(swaggerUi, {
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

    app.register(middie);

    const env = app.getEnvs<Env>();

    app.register(firebasePlugin, {
      credential: {
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY
          ? env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined,
      },
    });

    app.register(prismaPlugin);

    app.register(s3_plugin);
    app.addHook("onRequest", async (request, _reply) => {
      request.jwtService = new JwtService(env.JWT_SECRET);
    });

    //routes
    app.register(v1Routes, {
      prefix: "/api/v1",
    });

    // app.register(fastifyCron, {
    //   jobs: [
    //     {
    //       cronTime: "0 0 * * *",
    //       onTick: async (server) => {
    //         await refillCredits(server);
    //         console.log(`Refilled credits at ${dayjs().toISOString()}`);
    //       },
    //     },
    //   ],
    // });

    app.setErrorHandler((error, request, reply) => {
      request.log.error(error);
      reply.log.error(error);
      return reply.status(500).send({
        error,
        message: "Internal server error",
      });
    });

    return app;
  } catch (err) {
    console.log("Error building server: ", err);
    process.exit(1);
  }
};

const start = async (app: FastifyInstance) => {
  const cronJob = CronJob.from({
    cronTime: "0 0 * * *",
    onTick: async function () {
      await refillCredits(app);
    },
    onComplete: () => {
      console.log(`Refilled credits at ${dayjs().toISOString()}`);
    },
    timeZone: "Asia/Singapore",
  });

  try {
    const env = app.getEnvs<Env>();
    const isProd = env.NODE_ENV === "production";

    await app.listen({
      port: env.PORT,
      host: isProd ? "0.0.0.0" : "localhost",
    });

    cronJob.start();
  } catch (err) {
    app.log.error(err);
    cronJob.stop();
    process.exit(1);
  }
};

build()
  .then((server) => start(server))
  .catch((err) => {
    console.log("Error starting server: ", err);
  });
