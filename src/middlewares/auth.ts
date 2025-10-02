/* eslint-disable no-mixed-spaces-and-tabs */
import { Request, Response, NextFunction } from 'express';
import jwt, { Algorithm, JwtPayload, Secret, TokenExpiredError, VerifyErrors } from 'jsonwebtoken';
import logger from '../utils/logger';
import EnvVars from '@src/constants/EnvVars';

const secretKey = EnvVars.Jwt.Secret;
const algorithm: Algorithm = 'HS256';

export default function (req: Request, res: Response, next: NextFunction) {
  logger.info('[AuthInterceptor] Initiating token verification');
  const tokenName = 'x-access-token';
  let token = req.headers[tokenName] as string;
  if (!token) {
    token = req.cookies && req.cookies[tokenName];
  }
  if (!token) {
    token = req.signedCookies && req.signedCookies[tokenName];
  }
  if (token) {
    logger.info(
      '[AuthInterceptor] Token is available, proceeding with verification',
    );
    return jwt.verify(
      token,
			secretKey as Secret,
			{ algorithms: [algorithm] },
			(err: VerifyErrors | null, decoded?: JwtPayload | string) => {
			  if (err) {
			    const errordata = {
			      message: err.message,
			      expiredAt: (err as TokenExpiredError).expiredAt,
			    };
			    logger.error(
			      '[AuthInterceptor] Token is invalid or has expired, details: ',
			      errordata,
			    );
			    return res.status(401).json({
			      message: 'Unauthorized Access',
			    });
			  }
			  logger.info('[AuthInterceptor] Token verified successfully!');
			  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			  // @ts-ignore
			  req.decoded = decoded;
			  return next();
			},
    );
  } else {
    logger.error('[AuthInterceptor] Token not present in the request');
    return res.status(403).json({
      message: 'Forbidden Access',
    });
  }
}