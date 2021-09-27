FROM node:14.17.6 as base

WORKDIR /app

FROM base as builder

RUN mkdir ./pre_install
COPY package*.json ./pre_install/
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN npm ci --prefix ./pre_install

COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci
COPY . ./
RUN npm run build

FROM base as release

COPY --from=builder /app/pre_install ./

COPY package*.json .env.example ./
RUN mv .env.example .env

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/Index.js"]