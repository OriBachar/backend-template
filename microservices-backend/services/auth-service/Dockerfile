# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for the workspace
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy shared packages
COPY packages/ ./packages/

# Copy auth service
COPY services/auth-service/ ./services/auth-service/

# Install all dependencies (workspace)
RUN npm install

# Build shared packages first
RUN npm run build --workspace=packages/shared-config
RUN npm run build --workspace=packages/shared-types  
RUN npm run build --workspace=packages/shared-utils

# Build auth service
RUN npm run build --workspace=services/auth-service

# Production stage
FROM node:20-alpine

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy built shared packages
COPY --from=builder /app/packages/shared-config/dist ./packages/shared-config/dist
COPY --from=builder /app/packages/shared-config/package.json ./packages/shared-config/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/
COPY --from=builder /app/packages/shared-utils/dist ./packages/shared-utils/dist
COPY --from=builder /app/packages/shared-utils/package.json ./packages/shared-utils/

# Copy built auth service
COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist
COPY --from=builder /app/services/auth-service/package.json ./services/auth-service/

# Install only production dependencies
RUN npm ci --only=production

# Change ownership to non-root user
RUN chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Set working directory to service
WORKDIR /app/services/auth-service

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/v1/health || exit 1

# Start the application
CMD ["node", "dist/server.js"] 