.PHONY: locale locale-build locale-run locale-test upgrade help

.DEFAULT_GOAL := help

## Prettier files
prettier:
	npx prettier --write --no-error-on-unmatched-pattern '**/*.{js,md}'

## Build and run local docker image
locale: locale-build locale-run

## Run locale test
locale-test:
	curl -v -H 'Content-Type: application/json; charset=utf-8' --data "@test/payload.json" http://localhost:8090

## Get locale healthcheck
locale-healthcheck:
	docker inspect --format "{{json .State.Health }}" shiki-server-test | jq

## Build local docker image
locale-build:
	docker buildx build -f Dockerfile --load -t shiki-server-test .

## Run local docker image
locale-run:
	docker run --rm -it -p 8090:8090 -e "CORS=*" --name shiki-server-test shiki-server-test .

## Check for npm updates
upgrade:
	npm install -g npm-check-updates
	ncu -u

# Define colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

# define indention for descriptions
TARGET_MAX_CHAR_NUM=15

help:
	@echo ''
	@echo '${GREEN}CLI command list:${RESET}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ''
