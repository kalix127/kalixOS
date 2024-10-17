# Variables
COMPOSE_FILE=docker-compose.yml

# Default target
.PHONY: all
all: build up

# Build Docker images
.PHONY: build
build:
	@echo "Building Docker images..."
	docker compose -f $(COMPOSE_FILE) build

# Run Docker containers
.PHONY: upd
upd:
	@echo "Starting Docker containers..."
	docker compose -f $(COMPOSE_FILE) up -d

.PHONY: up
up:
	@echo "Starting Docker containers..."
	docker compose -f $(COMPOSE_FILE) up

# Stop and remove Docker containers
.PHONY: down
down:
	@echo "Stopping and removing Docker containers..."
	docker compose -f $(COMPOSE_FILE) down

# Restart Docker containers
.PHONY: restart
restart: down up

# View logs of all services
.PHONY: logs
logs:
	@echo "Viewing logs..."
	docker compose -f $(COMPOSE_FILE) logs -f

# Stop running containers
.PHONY: stop
stop:
	@echo "Stopping Docker containers..."
	docker compose -f $(COMPOSE_FILE) stop

# Remove stopped containers, networks, images, and volumes
.PHONY: clean
clean:
	@echo "Cleaning up unused Docker resources..."
	docker compose -f $(COMPOSE_FILE) down --volumes --rmi all --remove-orphans
