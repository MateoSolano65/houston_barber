# Base stage for shared configurations
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/

# Development stage
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build
RUN npm install
COPY . .
RUN npm run build
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

# Run as non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

CMD ["node", "dist/main"]