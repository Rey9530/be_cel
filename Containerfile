# Install dependencies only when needed
FROM node:20-alpine AS deps
ENV TZ=America/El_Salvador
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Build the app with cache dependencies
FROM node:20-alpine AS builder
ENV TZ=America/El_Salvador
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY prisma ./prisma/
COPY .env ./.env
RUN npx prisma generate
RUN yarn build


# Production image, copy all the files and run next
FROM node:20-alpine AS runner
ENV TZ=America/El_Salvador

# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod 
COPY --from=builder /app/dist ./
COPY prisma ./prisma/
RUN npx prisma generate

#RUN npx prisma migrate deploy

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD [ "node","main" ]