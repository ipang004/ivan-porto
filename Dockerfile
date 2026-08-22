# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build SvelteKit static site
RUN npm run build

# Stage 2: Production Nginx stage
FROM nginx:alpine AS runner

# Copy static build output to Nginx web root
COPY --from=builder /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
