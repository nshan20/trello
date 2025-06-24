import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TasksDto {
  @IsEmail()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  developer?: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  check?: boolean;
}
