# Fullstack Monorepo

A fullstack TypeScript monorepo with Node.js/Express backend and Next.js 15 frontend.

## Structure

```
├── backend/          # Express + TypeScript API
├── frontend/         # Next.js 15 + Tailwind CSS
└── types/            # Shared TypeScript types
```

## Prerequisites

- Node.js v22.11.0

## Installation

```bash
# Install all dependencies
npm install
npm run setup 
```

## Development

```bash
# Run both frontend and backend
npm run dev

# Run individually
npm run dev:backend
npm run dev:frontend
```

- Backend: http://localhost:3001
- Frontend: http://localhost:3000

## Build

```bash
# Build both
npm run build

# Build individually
npm run build:backend
npm run build:frontend
```

## Production

```bash
# Start both
npm start

# Start individually
npm start:backend
npm start:frontend
```

## Code Quality

```bash
# Format code with Prettier
npm run prettify

# Format and lint
npm run format
```
