FROM node:14.17.6 as base

WORKDIR /app

FROM base as front

COPY frontend/ ./
RUN npm i
RUN npm run build

FROM base as back

COPY --from=front /app/build ./frontend
COPY ./backend/ ./
RUN npm ci
RUN npm run build

FROM base as release

COPY --from=back /app/dist ./dist
COPY --from=back /app/frontend ./frontend
COPY backend/package*.json backend/.env.example backend/ormconfig.js ./
RUN mv .env.example .env
RUN npm ci --only=production

CMD ["node", "dist/Index.js"]
