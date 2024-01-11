import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateScheduleDto {
  @ApiProperty({})
  @IsString()
  hor_codigo: string;
  @ApiProperty({})
  @IsString()
  hor_nombre: string;

  @ApiProperty({})
  @IsArray()
  mar_hde_detalle_ho: [];
}
