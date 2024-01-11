import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsString()
  page: string;


  @ApiProperty()
  @IsString()
  quantity: string;


  @ApiProperty()
  @IsString()
  @IsOptional()
  query: string;


  @ApiProperty()
  @IsString()
  @IsOptional()
  company: string;

}
