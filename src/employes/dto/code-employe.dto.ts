import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { FORMAT_FECHA_DD_MM_YYYY } from 'src/common/const';

export class CodeEmployeDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha es incorrecta debe ser dd/mm/YYYY',
  })
  emp_fecha_nacimiento: string;

}
