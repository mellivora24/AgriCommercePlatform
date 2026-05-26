import type { Request } from 'express';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

type AuthUser = {
  userId: number;
  email: string;
  role: string;
  buyerId?: number;
  sellerId?: number;
  shipperId?: number;
  adminId?: number;
};

type AuthRequest = Request & {
  user?: AuthUser;
};

export type { JwtPayload, AuthUser, AuthRequest };
