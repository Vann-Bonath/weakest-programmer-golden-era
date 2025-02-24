import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApprovalStatus } from '../approval-request/approval-request';

export enum Rank {
  TheWeakest = 'TheWeakest',
  GradeOneBugMagnet = 'GradeOneBugMagnet',
  SpecialGradeDebugger = 'SpecialGradeDebugger',
  TheStrongest = 'TheStrongest',
}

enum AccountRole {
  User = 'user',
  God = 'god',
}

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  programmerName: string;

  @IsNotEmpty()
  @IsEnum(Rank)
  rank: Rank;

  @IsNotEmpty()
  role: AccountRole.User;

  @IsNotEmpty()
  status: ApprovalStatus.NewAccount;
}
