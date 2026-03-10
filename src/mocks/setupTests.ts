// src/setupTests.js
import { server } from './server'
import { beforeAll, afterEach, afterAll } from 'vitest'

// Establish MSW server before all tests
beforeAll(() => {
  server.listen()
})

// Reset any request handlers that are declared in a test
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())

server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url)
})
