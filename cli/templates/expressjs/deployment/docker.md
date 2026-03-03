# Docker & Kubernetes Deployment

## Dockerfile

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]
\`\`\`

## Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/myapp
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
\`\`\`

## Best Practices
- Use multi-stage builds
- Run as non-root user
- Use .dockerignore
- Implement health checks
- Use secrets management
