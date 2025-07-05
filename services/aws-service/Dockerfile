# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for the workspace
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy shared packages
COPY packages/ ./packages/

# Copy AWS service
COPY services/aws-service/ ./services/aws-service/

# Install all dependencies (workspace)
RUN npm install

# Build shared packages first
RUN npm run build --workspace=packages/shared-config
RUN npm run build --workspace=packages/shared-types  
RUN npm run build --workspace=packages/shared-utils

# Build AWS service
RUN npm run build --workspace=services/aws-service

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

# Copy built AWS service
COPY --from=builder /app/services/aws-service/dist ./services/aws-service/dist
COPY --from=builder /app/services/aws-service/package.json ./services/aws-service/

# Install only production dependencies
RUN npm ci --only=production

# Change ownership to non-root user
RUN chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Set working directory to service
WORKDIR /app/services/aws-service

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3003/api/v1/health || exit 1

# Start the application
CMD ["node", "dist/server.js"] 