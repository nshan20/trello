import { IsNumber, IsOptional } from 'class-validator';

export class UserAccessDto {
  @IsOptional()
  @IsNumber()
  adminUserId: number | null;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  boardId: number;
}
