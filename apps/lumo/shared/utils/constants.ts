/**
 * Common constants used throughout the application
 */

export const APP_CONSTANTS = {
  APP_NAME: 'Lumo',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@lumo.com',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify-code',
  },
  LEARNING: {
    SCHEDULES: '/api/learning-schedule',
    REQUESTS: '/api/requests',
  },
  CALL: {
    WEBSOCKET: '/ws/call',
  },
} as const

export const STORAGE_KEYS = {
  AUTH_SESSION: 'supabase-session',
  AUTH_PROVIDER: 'auth_provider',
  USER_PREFERENCES: 'user_preferences',
} as const

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 50,
  PHONE_MAX_LENGTH: 11,
} as const

export const TIME_CONSTANTS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30분
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000, // 5분
  DEBOUNCE_DELAY: 300, // 300ms
} as const 