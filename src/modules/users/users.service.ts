import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateUserDTO } from './users.type';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  private database: admin.database.Database;

  constructor(private firebaseService: FirebaseService) {
    this.database = this.firebaseService.getDatabase();
  }

  async createUser(createUserDTO: CreateUserDTO, firebaseUid: string) {
    const userRef = this.database.ref(`users/${firebaseUid}`);
    await userRef.set({ firebaseUid, ...createUserDTO });

    // Fetch the newly created user data
    const snapshot = await userRef.get();
    return snapshot.val();
  }

  async getUser(firebaseUid: string) {
    try {
      const userRef = this.database.ref(`users/${firebaseUid}`);
      const snapshot = await userRef.get();

      return snapshot.val();
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async getAllUser() {
    try {
      const userRef = this.database.ref(`users`);
      const snapshot = await userRef.get();

      return snapshot.val();
    } catch (error) {
      throw new Error(`Error get all user: ${error.message}`);
    }
  }
}
