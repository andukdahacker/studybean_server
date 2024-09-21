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

ARG PORT

WORKDIR /app

COPY package*.json ./
COPY ./prisma ./prisma
COPY --from=build /app/build ./build

RUN npm install --only=production
RUN npx prisma generate

ENV NODE_ENV=production

EXPOSE ${PORT}

CMD [ "npm", "start" ]
