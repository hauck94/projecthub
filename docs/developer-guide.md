# Developer Guide

This Guide is intended for Developers that want to contribute or just tinker with the project. It covers Setting up an development environment, testing the backend and frontend and coding standards.

## Table of contents

1. [Required Tools](#required-tools)
2. [Development Environment Setup](#quick-start-guide)
3. [Testing](#architecture)
4. [Code Style and Linting](#project-structure)

## Required Tools

To be able to develop you need the following tools:

- Docker
- docker-compose
- Node.js
- IDE with support for JavaScript/TypeScript

If you are using Visual Studio Code the following Plugins can ease your development process (These are just recomendations, no need to install them ;):

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [React](https://marketplace.visualstudio.com/items?itemName=burkeholland.simple-react-snippets)

## Development Environment Setup

This section describes how to setup an local development environment to be able to further develop and test the application.

### Frontend

1. Checkout/Clone Repo

2. (Only if project has already been built/tested/etc on local device) Delete following folders

- `node_modules`

and following files

- `package-lock.json`

3. Install npm packages from local project

- `cd packages/frontend`
- `npm install`

4. Run Frontend Project locally

- `npm run start`

_Keep in Mind:_ Some Components and Pages may need a Database & the Backend to function properly

### Backend

1. Checkout/Clone Repo

2. (Only if project has already been built/tested/etc on local device) Delete following folders

- `coverage`
- `dist`
- `node_modules`

and following files

- `.env`
- `package-lock.json`

3. Create/Copy environment file

- `cp ./packages/backend/.env.example ./packages/backend/.env`

4. Install npm packages from local project

- `cd packages/backend`
- `npm install`

Or install npm packages from docker

- `docker-compose run backend npm install`

5. Start docker containers

- `docker-compose up` / `docker-compose up -d`

6. Sync database with entities

- `docker-compose exec backend npm run typeorm schema:sync`

## Testing

In this section we discuss how to test the application code. There are different methods for starting tests. because we are using a docker-compose development stack this guide makes use of this setup.

### Backend Tests

Backend tests are done via jest (https://www.npmjs.com/package/jest) and supertest (https://www.npmjs.com/package/supertest)

1. If docker containers are running and the database is synchronized, load fixtures(test data) into db

   ```bash
   docker-compose exec backend npm run fixtures
   ```

   _Keep in Mind:_ Executing this command twice will add the same fixtures again with different ID's

2. To run the tests use the following command:

   ```bash
   docker-compose exec backend npm run test
   ```

### Frontend Tests

Frontend tests are also done via jest (https://www.npmjs.com/package/jest).

1. There are no dependencies to test the frontend. Therefor you can use the following command to run all tests:

   ```bash
   docker-compose exec frontend npm run test
   ```

## Code Style and Linting

This Project uses ESlint and Prettier rules to enforce consistent code style of the front- and backend code. These Rules are enforced during the CI / CD pipeline execution. If new changes don't comply to the code standard they are rejected! Please make sure you setup your development IDE to use the specified rules and check for linting-errors before you push new changes. The following commands can be used to check for linting errors:

**Backend**

```bash
docker-compose exec backend npm run lint
```

**Frontend**

```bash
docker-compose exec frontend npm run lint
```
