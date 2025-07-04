import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  @IsNotEmpty()
  lastName: string;
}