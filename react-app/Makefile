include common.mk

# Directories
SRC_DIR = src
TEST_DIR = $(SRC_DIR)/tests
BUILD_DIR = build
PUBLIC_DIR = public

FORCE:
.PHONY: install dev build lint test test-run test-watch format clean ci

install:
    npm ci

dev:
    npm run dev

prod: build

build: FORCE
	npm run build

test: FORCE
	npm test

lint: FORCE
	npm run lint

dev_env: FORCE
	npm install
test:
    npm run test:watch

test-run:
    npm run test:run

format:
    npm run format

ci: install lint test-run build

docs: FORCE
	@echo "Documentation can be found in the README.md file."

clean: FORCE
	rm -rf $(BUILD_DIR)