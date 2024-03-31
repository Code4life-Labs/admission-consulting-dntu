import { env } from '../config/environment'

export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  EXPIRED: 410 //GONE
}

export const WHITELIST_DOMAINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // từ FE call về BE
  'https://v3-api.fpt.ai', // từ fptai call về BE
  env.CLIENT
]

let websiteDomain = 'http://localhost:3000'
if (env.BUILD_MODE === 'production') {
  websiteDomain = 'https://dong-nai-travel-admin.vercel.app'
}

export const WEBSITE_DOMAIN = websiteDomain