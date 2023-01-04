# Crosswords

Allows for creating, and cooperatively doing crossword puzzles 

## Running UI

To build and run the ui for the first time, execute the following scripts. On subsequent runs, only running `npm start` in the `ui` folder is required

```bash
cd ui
npm install
npm start
```

## Running Mock Server

By default ui is configured to run against mock database

```bash
cd ui
npm run startapi
```

## Deploying application
### Deploying Dev

Deploying to dev environment

```bash
sam build --config-file samconfig.toml --config-env dev
sam deploy --config-file samconfig.toml --config-env dev
```

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
sam-app$ sam local start-api
sam-app$ curl http://localhost:3000/
```
