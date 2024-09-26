import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode, JwtPayload } from 'jsonwebtoken';

const extractBearerToken = (auth: string): string => {
  const token = auth.match(/bearer (?<token>.*)/i)?.groups?.token;
  if (!token) {
    throw new Error('Invalid token or not a Bearer token');
  }
  return token;
};

export interface TokenDataInterface {
  globalProfileId: string | number;
  nameId?: string;
  username?: string;
  token: string;
}

export const TokenData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenDataInterface => {
    const request = ctx.switchToHttp().getRequest();
    const token = extractBearerToken(request.get('authorization'));
    const tokenData = decode(token) as JwtPayload;
    return {
      globalProfileId: tokenData?.globalProfileId,
      nameId: tokenData?.nameid,
      username: tokenData?.unique_name,
      token,
    };
  },
);
