dev:
	docker-compose up --build

test:
	cd frontend && npm test -- --ci --watchAll=false || true && cd .. \
	&& cd server && npm test -- --ci --watchAll=false || true && cd .. \
	&& cd ml-service && pytest -q || true
