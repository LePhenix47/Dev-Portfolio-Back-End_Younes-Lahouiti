# Dev Portfolio Backend (Bun + Hono)

### Description

This project is the backend for the **Dev Portfolio** application, built with [Bun](https://bun.sh/) and [Hono](https://hono.dev/). It serves as the API layer, handling requests efficiently with minimal overhead.

This backend is containerized using Docker and includes a CI/CD pipeline for automated testing, building, and deployment.

## Table of contents

- [Dev Portfolio Backend (Bun + Hono)](#dev-portfolio-backend-bun--hono)
    - [Description](#description)
  - [Table of contents](#table-of-contents)
  - [Tech stack](#tech-stack)
  - [Pre-requisites](#pre-requisites)
    - [Bun](#bun)
    - [Docker](#docker)
  - [Configuration](#configuration)
  - [Installation and usage](#installation-and-usage)
  - [Running the project](#running-the-project)
    - [Development](#development)
      - [API Documentation](#api-documentation)
    - [Production (Docker)](#production-docker)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Deployment](#deployment)

## Tech stack

- **Bun 1.2.2** - A fast JavaScript runtime
- **Hono** - Lightweight web framework for creating back-ends using TS
- **Docker** - Containerized deployment to deploy our API to Clouds or VPSs
- **GitHub Actions** - CI/CD pipeline

<a href="https://bun.sh/" target="_blank" rel="noreferrer" title="Bun">
  <img src="https://oauth.net/images/code/bun.png" width="42" height="36" alt="Bun logo" />
</a>
<a href="https://hono.dev/" target="_blank" rel="noreferrer" title="Hono">
  <img src="https://hono.dev/images/logo.png" width="36" height="36" alt="Hono logo" />
</a>
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer" title="TypeScript">
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" width="36" height="36" alt="TypeScript logo" />
</a>
<a href="https://github.com/features/actions" target="_blank" rel="noreferrer" title="GitHub actions">
  <img src="./static/img/github-actions-logo.png" width="36" height="36" alt="GitHub actions logo" />
</a>
<a href="https://www.docker.com/" target="_blank" rel="noreferrer" title="Docker">
  <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-1024.png" width="36" height="36" alt="Docker logo" />
</a>

## Pre-requisites

### Bun

This project requires **Bun 1.2.2**. You can install it using:

```npm
npm install -g bun
```

[See full Bun documentation for installation](https://bun.sh/docs/installation)

### Docker

Ensure you have Docker installed to run the application in a containerized environment. You can download it from [here](https://www.docker.com/).

## Configuration

The project uses a `.env` file for environment variables. Create a `.env` file in the root directory and populate it with your values based on the [`.env.sample`](./.env_sample) file:

```env
NODE_ENV=development
PORT=3000
DISCORD_WEBHOOK_URL=
```

## Installation and usage

Clone the repository:

```sh
# Note you can use "." to clone the repository in the same directory without creating a new folder
git clone https://github.com/LePhenix47/Dev-Portfolio-Back-End_Younes-Lahouiti ./[FOLDER_NAME] 

cd dev-portfolio-bun-hono-backend
```

Install dependencies:

```sh
bun install
```

## Running the project

### Development

Run the server in development mode:

```sh
bun dev
```

The server will be available at `http://localhost:3000/api`.

#### API Documentation

This project includes interactive API documentation:

- **OpenAPI**: Available at `http://localhost:3000/api/docs`
- **Scalar**: A modern alternative to Swagger, available at `http://localhost:3000/api/scalar`

These interfaces provide an easy way to explore and test API endpoints.

### Production (Docker)

Build and run the containerized application locally:

```sh
docker build -t bun-hono-backend .

docker run -p 3000:3000 --env-file .env bun-hono-backend
```

## CI/CD Pipeline

This project includes a **GitHub Actions** workflow for:

- Running tests
- Building the Bun application
- Packaging and pushing a Docker image to DockerHub

The workflow is defined in `.github/workflows/bun.yml`.

## Deployment

The backend can be deployed to a cloud service or a VPS:

- **Docker Hub + VPS**: Pull the image and run it on your VPS
- **AWS/GCP/Azure**: Deploy using ECS, Cloud Run, or App Services

Example VPS deployment:

```sh
docker pull [YOUR_DOCKER_USERNAME]/[DOCKERHUB_REPO_NAME]
docker run -d -p 3000:3000 --env-file .env [YOUR_DOCKER_USERNAME]/[DOCKERHUB_REPO_NAME]
```
