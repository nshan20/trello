import { IsOptional, IsString } from 'class-validator';

export class ListDto {
  @IsString()
  @IsOptional()
  title: string;
}
