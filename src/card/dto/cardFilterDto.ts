import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsInt,
  Min, IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Priority {
  lov = 'lov',
  medium = 'medium',
  high = 'high',
}

export class CardFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  deadlineFlag?: string;

  @IsOptional()
  @IsString()
  access?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // targetUserId?: number;
}
