import * as Sentry from '@sentry/serverless'

Sentry.GCPFunction.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})

export { Sentry }
