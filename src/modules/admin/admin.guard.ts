import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class GodGuard implements CanActivate {
  private database: admin.database.Database;

  constructor() {
    this.database = admin.database();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User should be authenticated

    if (!user || !user.uid) {
      throw new ForbiddenException('Unauthorized: No user ID');
    }

    // Fetch user role from Realtime Database
    const userRef = this.database.ref(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists()) {
      throw new ForbiddenException('User not found');
    }

    const userData = snapshot.val();
    request.user.role = userData.role; // Attach role to request object

    return true; // Proceed to the next guard
  }
}
