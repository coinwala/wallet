version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: hyper
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  prisma-migrate:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - .:/app
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://myuser:mypassword@postgres:5432/hyper?schema=public
    command: >
      sh -c "npm install prisma &&
             npx prisma migrate dev"

volumes:
  postgres-data: