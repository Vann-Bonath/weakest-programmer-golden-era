import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AccountRole } from '../users/users.type';

@Injectable()
export class GodGuard implements CanActivate {
  private database: admin.database.Database;
  private auth: admin.auth.Auth;

  constructor() {
    this.database = admin.database();
    this.auth = admin.auth();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authentication token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // ✅ Verify Firebase Token
      const decodedToken = await this.auth.verifyIdToken(token);
      request.user = decodedToken;

      if (!request.user || !request.user.uid) {
        throw new ForbiddenException('Unauthorized: No user ID');
      }

      // ✅ Fetch user role from Firebase Realtime Database
      const userRef = this.database.ref(`users/${request.user.uid}`);
      const snapshot = await userRef.get();

      if (!snapshot.exists()) {
        throw new ForbiddenException('User not found');
      }

      const userData = snapshot.val();
      request.user.role = userData.role; // Attach role to request object

      // 🔴 Check if the user has the "God" role
      if (request.user.role !== AccountRole.God) {
        throw new ForbiddenException(
          'Access Denied: You must be a God to proceed',
        );
      }

      return true; // Allow access
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
