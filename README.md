# DevOps Portfolio CI/CD

![Build and Push Portfolio Image](https://github.com/alistohy/devops-portfolio-cicd/actions/workflows/docker-image.yml/badge.svg)

## Overview

Containerized personal DevOps portfolio website served via **Nginx** (`nginx:stable-alpine`), complete with a custom Nginx configuration, health check endpoint, **Docker Compose** setup, and an automated **GitHub Actions** pipeline that builds and publishes the container image to **GitHub Container Registry (GHCR)**.

## Tech Stack

- **Web Server:** Nginx (`nginx:stable-alpine`)
- **Frontend:** HTML5, CSS3, JavaScript
- **Containers:** Docker, Docker Compose
- **CI/CD & Registry:** GitHub Actions, GitHub Container Registry (`ghcr.io`)

## Project Structure

```text
devops-portfolio-cicd/
├── app/
│   ├── index.html                        # Portfolio frontend
│   ├── style.css
│   └── script.js
├── nginx/
│   └── default.conf                      # Custom Nginx server block & /health endpoint
├── Dockerfile                            # Lightweight Nginx Alpine image build
├── docker-compose.yml                    # Local orchestration on port 8080
├── .github/workflows/docker-image.yml    # Automated build & push to GHCR
└── README.md
```

## CI/CD Pipeline

On every push to the `main` branch, the GitHub Actions workflow (`.github/workflows/docker-image.yml`):
1. Checks out the repository code.
2. Authenticates with GitHub Container Registry (`ghcr.io`).
3. Extracts Docker metadata and tags (`latest` and commit `sha`).
4. Builds and pushes the image to `ghcr.io/alistohy/devops-portfolio-cicd`.

## Running Locally

### Using Docker Compose

```bash
docker compose up -d --build
```

### Using Docker CLI

```bash
docker build -t devops-portfolio:latest .
docker run -d -p 8080:80 --name ali-portfolio devops-portfolio:latest
```

### Pulling Pre-built Image from GHCR

```bash
docker pull ghcr.io/alistohy/devops-portfolio-cicd:latest
docker run -d -p 8080:80 ghcr.io/alistohy/devops-portfolio-cicd:latest
```

## Testing

Access the portfolio and verify the Nginx health check endpoint:

```bash
curl http://localhost:8080/
curl http://localhost:8080/health
```

## Author

**Ali Stohy**
- GitHub: [alistohy](https://github.com/alistohy)
- LinkedIn: [Ali Stohy](https://www.linkedin.com/in/ali-stohy-453792239/)
