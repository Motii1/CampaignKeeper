FROM node:14.17.6 as base

WORKDIR /app

FROM base as front

COPY frontend/ static/
RUN npm ci --prefix static
RUN cd static && npm run build

FROM front as back

COPY --from=front /app/static/build ./static/build

COPY backend/package*.json ./
RUN npm ci
COPY ./backend ./
RUN npm run build

FROM back as release

COPY --from=back /app/ ./
COPY backend/.env.example ./.env

CMD ["node", "dist/Index.js"]