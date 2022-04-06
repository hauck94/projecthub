import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // hashing library
import { Request, Response, NextFunction } from 'express';

export class Authentication {
  private static JWT_OPTIONS: jwt.SignOptions = {
    expiresIn: 3600, // token will be invalid after one hour
  };
  private static SALT_ROUNDS = 8;

  public static async generateToken(userdata: any): Promise<string> {
    return jwt.sign(userdata, process.env.ACCESS_TOKEN_SECRET, this.JWT_OPTIONS);
  }

  public static async verifyToken(token: string): Promise<string | object | null> {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
      return null;
    }
  }

  public static async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public static async comparePasswordWithHash(password: string, hash: string) {
    // check if the password matches with the hashed password
    try {
      const match: boolean = await bcrypt.compare(password, hash);
      return match;
    } catch (e) {
      return false;
    }
  }

  public static async verifyAccess(req: Request, res: Response, next: NextFunction) {
    // Get authorization header from the request
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).send({ status: 'unauthorized access' });
    }

    const isValidToken = await Authentication.verifyToken(token);
    if (!isValidToken) {
      return res.status(401).send({ status: 'unauthorized access' });
    }

    return next();
  }
}
