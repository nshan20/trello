import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';


export class CardDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsString()
  @IsOptional()
  checklist?: string;

  @IsString()
  @IsOptional()
  members?: string;

  @IsString()
  @IsOptional()
  labels?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  deadlineFlag?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  data?: Date;
}
