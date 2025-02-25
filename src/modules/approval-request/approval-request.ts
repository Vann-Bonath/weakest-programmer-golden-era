import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Rank } from '../users/users.type';

export enum ApprovalStatus {
  NewAccount = 'new-account',
  PendingUpdate = 'pending-update',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type CreateApprovalRequestDTO = {
  rank: Rank;
};

export class ApprovalRequest {
  @IsString()
  requestId: string;

  @IsString()
  requestorId: string;

  @IsOptional()
  requestData?: {
    rank: Rank;
  };

  @IsNotEmpty()
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @IsString()
  updatedAt: any;
}
