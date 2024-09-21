FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY ./src ./src

RUN npm run build

FROM node:lts-alpine as production

ARG DATABASE_URL

WORKDIR /app

COPY package*.json ./
COPY ./prisma ./prisma
COPY --from=build /app/build ./build

RUN npm install --only=production
RUN npx prisma migrate deploy
RUN npx prisma generate

ENV NODE_ENV=production

EXPOSE 8080

CMD [ "npm", "start" ]
