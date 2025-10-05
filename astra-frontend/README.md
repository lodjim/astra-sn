# Astra Frontend

Modern Next.js web application for interacting with the Astra ML prediction service.

## Features

- **Interactive UI**: Clean, responsive interface
- **Real-time Predictions**: Connect to backend API
- **Data Visualization**: Display prediction results
- **File Upload**: Support for CSV batch predictions

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

```bash
npm run build
npm start
```

## Configuration

Ensure the backend API URL is configured correctly to connect to the FastAPI service running on `http://127.0.0.1:8000`

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Environment Variables

Create a `.env.local` file for environment-specific configuration (not tracked in git).
