import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Rank {
  TheWeakest = 'TheWeakest',
  GradeOneBugMagnet = 'GradeOneBugMagnet',
  SpecialGradeDebugger = 'SpecialGradeDebugger',
  TheStrongest = 'TheStrongest',
}

export enum AccountRole {
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
}
