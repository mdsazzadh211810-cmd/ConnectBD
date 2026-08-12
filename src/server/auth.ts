import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, UserDBRecord } from './db.js';
import { UserRole } from '../types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'connectbd_jwt_secret_key_2026_bd';
const COOKIE_NAME = 'connectbd_session';

export interface AuthenticatedRequest extends Request {
  user?: UserDBRecord;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: UserDBRecord): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME);
}

export function extractUserMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.[COOKIE_NAME];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
      const user = db.findUserById(decoded.id) || db.findUserByEmail(decoded.email);
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Invalid/expired token, proceed without req.user
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Please log in with valid credentials.' 
    });
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted to [${roles.join(', ')}] role(s). Current role: ${req.user.role}` 
      });
    }
    next();
  };
}

export function requireDemoMode(req: Request, res: Response, next: NextFunction) {
  const isDemo = process.env.DEMO_MODE !== 'false';
  if (!isDemo) {
    return res.status(403).json({
      success: false,
      message: 'Role/Persona switching is strictly disabled in Production Mode.'
    });
  }
  next();
}
