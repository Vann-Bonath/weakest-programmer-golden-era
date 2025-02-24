import { Module } from '@nestjs/common';
import { ApprovalRequestController } from './approval-request.controller';
import { ApprovalRequestService } from './approval-request.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [ApprovalRequestController],
  providers: [ApprovalRequestService, FirebaseService],
})
export class ApprovalRequestModule {}
