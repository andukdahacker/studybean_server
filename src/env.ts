type Env = {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  GOOGLE_GEMINI_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  NODE_ENV: "development" | "production";
  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  S3_REGION: string;
  S3_BUCKET_NAME: string;
  S3_CLOUDFRONT_DOMAIN: string;
};

export default Env;
