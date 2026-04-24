# Stage 1: Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Build arguments
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime stage (Nginx)
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Default port if not provided
ENV PORT=80

# Expose port (Render ignores this but good for documentation)
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:$PORT || exit 1

# Metadata labels
LABEL maintainer="HCMS DevOps Team"
LABEL version="1.0"
LABEL description="Production image for HCMS Frontend (Render Optimized)"

# Nginx alpine image automatically runs envsubst on files in /etc/nginx/templates/
CMD ["nginx", "-g", "daemon off;"]
