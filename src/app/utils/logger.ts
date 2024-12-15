import * as Sentry from '@sentry/react';

type LoggingOptions = {
    extra?: Record<string, any>;
    contexts?: Record<string, any>;
};

export const logError = (error: unknown, options?: LoggingOptions) => {
    if (process.env.NODE_ENV === 'development') {
        console.error('Logged Error:', error, options);
    }

    Sentry.captureException(error, options);
};
