This folder is populated by code generation.

How to generate (already configured in package.json):

1) From project root, run inside `log-detect-frontend_new/`:

   npm run gen:api

2) The command uses `openapi-typescript-codegen` with `--client axios` to produce:

- core/OpenAPI.ts (runtime config)
- services/* (API methods)
- models/* (types)

It reads OpenAPI spec from `../log-detect-backend/docs/openapi.yml` and outputs here.

After generation, import from `@/api/openapiClient` to use services with app auth config.

