import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Rank } from '../users/users.type';

export enum ApprovalStatus {
  PendingUpdate = 'pending-update',
  Approved = 'approved',
  Rejected = 'rejected',
}

export class CreateApprovalRequestDTO {
  @IsOptional()
  rank?: Rank;

  @IsString()
  remark: string;
}

export class ApprovalRequest {
  @IsString()
  requestId: string;

  @IsString()
  requestorId: string;

  @IsOptional()
  requestData?: CreateApprovalRequestDTO;

  @IsNotEmpty()
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @IsString()
  updatedAt: any;
}
