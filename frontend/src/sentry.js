import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN || '', // Set your DSN in the environment
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

export default Sentry;
