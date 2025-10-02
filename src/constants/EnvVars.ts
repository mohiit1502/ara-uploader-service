/**
 * Environments variables declared here.
 */

import { NodeEnvs } from './misc';

/* eslint-disable node/no-process-env */
export type EnvVarType =
  {
    [key: string]: string | number | { [key: string]: unknown },
    NodeEnv: NodeEnvs,
    Port: number,
    Jwt: { [key: string]: string },
    CookieProps: { Key: string, Secret: string, Options: { [key: string]: unknown } }
  }

export default {
  NodeEnv: (process.env.NODE_ENV as NodeEnvs ?? ''),
  Port: (process.env.PORT ?? 0) as number,
  CookieProps: {
    Key: 'ExpressGeneratorTs',
    Secret: (process.env.COOKIE_SECRET ?? ''),
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: (process.env.COOKIE_PATH ?? ''),
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: (process.env.COOKIE_DOMAIN ?? ''),
      secure: (process.env.SECURE_COOKIE === 'true'),
    },
  },
  Jwt: {
    Secret: (process.env.JWT_SECRET ?? ''),
    Exp: (process.env.COOKIE_EXP && process.env.COOKIE_EXP !== ''
      ? process.env.COOKIE_EXP : '1h'), // exp at the same time as the cookie
  },
  S3_BUCKET: process.env.S3_BUCKET ?? '',
  S3_REGION: process.env.S3_REGION ?? '',
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY ?? '',
  S3_SECRET_KEY: process.env.S3_SECRET_KEY ?? '',
} as EnvVarType;
