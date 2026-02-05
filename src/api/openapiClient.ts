// Wrapper for the generated OpenAPI client (typescript-axios)
// - Configures BASE URL and TOKEN provider to reuse existing auth state
// - Re-exports generated types/services for convenient imports

import { getToken } from '@/store/auth'

// Import side-effect to configure OpenAPI after codegen output exists.
// The generated index re-exports `OpenAPI` and all services/models.
// Note: This file assumes `npm run gen:api` has produced `src/api/generated`.
// Until then, importing from this module should be deferred.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type {} from './generated'
// We import OpenAPI specifically to set runtime config. The path is the public index of generated outputs.
// When codegen is present, the following import will resolve.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { OpenAPI } from './generated'

// Base API URL (falls back to dev default)
OpenAPI.BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8006'

// Provide token dynamically before each request
OpenAPI.TOKEN = async () => {
  return getToken() || ''
}

// Export everything from generated client (services, models, helper types)
export * from './generated'

