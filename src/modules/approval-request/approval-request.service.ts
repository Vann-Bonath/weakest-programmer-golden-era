import { Injectable } from '@nestjs/common';
import {
  ApprovalRequest,
  ApprovalStatus,
  CreateApprovalRequestDTO,
} from './approval-request';
import * as admin from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class ApprovalRequestService {
  private database: admin.database.Database;

  constructor(private firebaseService: FirebaseService) {
    this.database = this.firebaseService.getDatabase();
  }

  async createRequest(
    firebaseUid: string,
    createApprovalRequestDTO: CreateApprovalRequestDTO,
  ) {
    const requestRef = this.database.ref('approval-requests').push();

    const newRequest: ApprovalRequest = {
      requestorId: firebaseUid,
      requestData: { rank: createApprovalRequestDTO.rank },
      status: ApprovalStatus.PendingUpdate,
      updateAt: new Date().toISOString(),
    };

    await requestRef.set(newRequest);

    return newRequest;
  }

  async approveRequest(requestId: string, firebaseUid: string) {
    const requestRef = this.database.ref(`approval-requests/${requestId}`);
    const snapshot = await requestRef.get();

    await requestRef.update({
      status: ApprovalStatus.Approved,
      approvedBy: firebaseUid,
      updatedAt: new Date().toISOString(),
    });

    const userRef = this.database.ref(`users/${snapshot.val().requestorId}`);
    await userRef.update({
      rank: snapshot.val().requestData.rank,
    });

    return {
      message: 'Request approved successfully, user rank updated',
      requestId,
      approvedBy: firebaseUid,
      newRank: snapshot.val().requestData.rank,
    };
  }
}
