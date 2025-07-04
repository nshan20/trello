import { IsDate, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @IsInt()
  id: number;

  @IsDate()
  createAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsEmail()
  email: string;

  @IsString()
  hash: string;

  @IsOptional()
  @IsString()
  firstName: string | null;

  @IsOptional()
  @IsString()
  lastName: string | null;
}
