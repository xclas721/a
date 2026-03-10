// src/mocks/server.js
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Set up MSW server with request handlers
export const server = setupServer(...handlers)
