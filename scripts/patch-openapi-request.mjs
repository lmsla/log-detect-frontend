import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const file = resolve(process.cwd(), 'src/api/generated/core/request.ts')
if (!existsSync(file)) {
  console.warn('[postgen] skip: file not found', file)
  process.exit(0)
}

let src = readFileSync(file, 'utf8')

// Ensure import for app axios
if (!src.includes("from '../../http'")) {
  src = src.replace(
    /import axios from 'axios';/,
    "import axios from 'axios';\n// Use the app's axios instance with auth/refresh interceptors\nimport { http as appAxios } from '../../http';"
  )
}

// Replace default axios client param to use appAxios
src = src.replace(
  /(export const request[\s\S]*?axiosClient: AxiosInstance = )axios\)/,
  "$1appAxios)"
)

writeFileSync(file, src)
console.log('[postgen] Patched generated core/request.ts to use app axios instance')

