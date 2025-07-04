import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ListDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  listId?: number;
}
