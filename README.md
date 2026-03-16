# Study App (Next.js)

This project is configured for deployment on Heroku.

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Heroku Deployment

### 1. Prerequisites

- Heroku account
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Git repo with this project committed

### 2. Create App and Set Stack

```bash
heroku login
heroku create <your-app-name>
heroku stack:set heroku-24 -a <your-app-name>
```

### 3. Deploy

```bash
git push heroku main
```

If your default branch is `master`, use:

```bash
git push heroku master
```

### 4. Open App

```bash
heroku open -a <your-app-name>
```

## Runtime Notes

- `Procfile` defines the web process:
  - `web: npm run start -- -H 0.0.0.0 -p $PORT`
- Node and npm versions are pinned in `package.json` under `engines`.
- Heroku will install dependencies and run the project build (`npm run build`) during slug compilation.

