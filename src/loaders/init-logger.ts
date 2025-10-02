/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import pkg from 'winston';
import util from 'util';

const { createLogger, transports, format } = pkg;

let logger: pkg.Logger | null = null;
const formatted = (appName: string) => format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  {
    transform: (info) => {
      const args = info[Symbol.for('splat')];
      if (Array.isArray(args)) { info.message = util.format(info.message, ...args); }
      return info;
    },
  },
  format.colorize(),
  format.printf(({ level, message, label, timestamp }) =>
    `[${appName}][${timestamp as string}] ${(label || '-') as string} ${level}: ${message as string}`),
);

export function logInit(appName: string) {
  if (!logger && appName) {
    const format = formatted(appName);
    logger = createLogger({
      transports: [
        new transports.File({
          filename: 'araup.out.log',
          level: 'info',
          format,
        }),
        new transports.File({
          filename: 'araup.error.log',
          level: 'error',
          format,
        }),
        new transports.Console({
          level: 'info',
          format,
        }),
        new transports.Console({
          level: 'error',
          format,
        }),
      ],
    });
    logger.info('[NSK][LOGGER] Using app namespace', appName);
    global.logger = logger;
  }
  return logger;
}

export default logger;
