# Use the official Bun image
FROM --platform=linux/amd64 oven/bun:1.1.38

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    python3 \
    make \
    tar \
    git

# Install Rust and Nargo dependencies - Updated for ARM compatibility
RUN apt-get update && apt-get install -y curl build-essential && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    . "$HOME/.cargo/env" && \
    # Install Nargo v0.39.0 with architecture detection
    ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ]; then \
        GITHUB_URL="https://github.com/noir-lang/noir/releases/download/v0.39.0/nargo-aarch64-apple-darwin.tar.gz"; \
    else \
        GITHUB_URL="https://github.com/noir-lang/noir/releases/download/v0.39.0/nargo-x86_64-unknown-linux-gnu.tar.gz"; \
    fi && \
    curl -L "${GITHUB_URL}" -o nargo.tar.gz && \
    tar -xzf nargo.tar.gz && \
    mv nargo /usr/local/bin/ && \
    chmod +x /usr/local/bin/nargo && \
    rm nargo.tar.gz

# Add Rust to PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lockb .
COPY tsconfig.json .
COPY tsconfig.base.json .

# Copy workspace packages
COPY packages ./packages
COPY apps ./apps

# Clear Bun's cache and install dependencies
RUN mkdir -p ~/.bun/install/cache && \
    chmod -R 777 ~/.bun && \
    bun install --no-cache

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV PATH="/usr/local/bin:${PATH}"

# Expose the port
EXPOSE 3001

CMD bun run zk:build && bun run api:start
