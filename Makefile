.PHONY: help build up down restart logs clean deploy stop

help:
	@echo "Payment Webhook System - Makefile Commands"
	@echo ""
	@echo "  make deploy    - Build and start all services"
	@echo "  make up        - Start services (without rebuild)"
	@echo "  make down      - Stop and remove containers"
	@echo "  make restart   - Restart all services"
	@echo "  make logs      - Show logs from all services"
	@echo "  make logs-f    - Follow logs in real-time"
	@echo "  make stop      - Stop services without removing"
	@echo "  make clean     - Remove containers, volumes, and images"
	@echo "  make test      - Send test webhook"
	@echo ""

deploy: build up
	@echo "✓ Services deployed successfully!"
	@echo ""
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8001"
	@echo "API Docs: http://localhost:8001/docs"

build:
	@echo "Building Docker images..."
	docker compose build

up:
	@echo "Starting services..."
	docker compose up -d
	@echo "Waiting for services to be ready..."
	@sleep 5
	@docker compose ps

down:
	@echo "Stopping services..."
	docker compose down

restart: down up

stop:
	@echo "Stopping services..."
	docker compose stop

logs:
	docker compose logs --tail=50

logs-f:
	docker compose logs -f

clean:
	@echo "Cleaning up..."
	docker compose down -v --rmi local
	@echo "✓ Cleanup complete"

test:
	@echo "Sending test webhook..."
	@curl -s -X POST http://localhost:3000/api/trigger-webhook \
		-H "Content-Type: application/json" \
		-d '{"payment_id":"pay_test_$(shell date +%s)","order_id":"ord_test_$(shell date +%s)","amount":99.99,"status":"completed","currency":"USD","payment_method":"credit_card","customer_email":"test@example.com"}' | jq .
	@echo ""
	@echo "✓ Webhook sent! Check http://localhost:3000"

status:
	@echo "Service Status:"
	@docker compose ps
	@echo ""
	@echo "Backend Health:"
	@curl -s http://localhost:8001/health | jq .
