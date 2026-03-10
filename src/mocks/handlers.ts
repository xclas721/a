// src/mocks/handlers.js
import { indexMock } from '@/mocks/mock/indexMock'
import { cardBinMock } from '@/mocks/mock/cardBinMock'
import { sysCodeMock } from '@/mocks/mock/sysCodeMock'

export const handlers = [...sysCodeMock, ...indexMock, ...cardBinMock]
