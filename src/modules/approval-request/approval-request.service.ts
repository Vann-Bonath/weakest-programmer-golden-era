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
      requestId: requestRef.key,
      requestorId: firebaseUid,
      requestData: { rank: createApprovalRequestDTO.rank },
      status: ApprovalStatus.PendingUpdate,
      updatedAt: new Date().toISOString(),
    };

    await requestRef.set(newRequest);

    return newRequest;
  }

  async approveRequest(requestId: string, firebaseUid: string) {
    try {
      const requestRef = this.database.ref(`approval-requests/${requestId}`);
      const snapshot = await requestRef.get();
      const requestData = snapshot.val();

      // Check if request exists
      if (!snapshot.exists()) {
        throw new Error(
          `Approval request with ID ${requestId} does not exist.`,
        );
      }

      // Check if already approved or rejected
      if (requestData.status !== ApprovalStatus.PendingUpdate) {
        throw new Error(`Approval request is already ${requestData.status}.`);
      }

      const updates: Record<string, any> = {};
      updates[`approval-requests/${requestId}/status `] =
        ApprovalStatus.Approved;
      updates[`approval-requests/${requestId}/approvedBy`] = firebaseUid;
      updates[`approval-requests/${requestId}/updatedAt`] =
        new Date().toISOString();
      updates[`users/${requestData.requestorId}/rank`] =
        requestData.requestData.rank;

      await this.database.ref().update(updates);

      return {
        message: 'Request approved successfully, user rank updated',
        requestId,
        approvedBy: firebaseUid,
        newRank: snapshot.val().requestData.rank,
      };
    } catch (error) {
      throw new Error(`something up because of : ${error}`);
    }
  }
}
