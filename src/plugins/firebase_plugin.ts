import { FastifyInstance } from "fastify";
import { initializeApp, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import fp from "fastify-plugin";
import admin from "firebase-admin";

declare module "fastify" {
  interface FastifyInstance {
    firebase: App;
    firebaseAuth: Auth;
  }
}

async function firebasePlugin(fastify: FastifyInstance, options: any) {
  console.log("options", options);
  if (!fastify.hasDecorator("firebase")) {
    const firebaseApp = initializeApp({
      credential: admin.credential.cert(options.credential),
    });
    const firebaseAuth = getAuth();

    fastify.decorate("firebase", firebaseApp);
    fastify.decorate("firebaseAuth", firebaseAuth);
  } else {
    throw new Error("Firebase already registered");
  }
}

export default fp(firebasePlugin);
