import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { FORMAT_FECHA_DD_MM_YYYY } from 'src/common/const';

export class CreateProjectDto {

  @ApiProperty({})
  @IsString()
  @MinLength(4)
  ctr_nombre: string;

  @ApiProperty({})
  @IsString()
  @MinLength(4)
  ctr_numero_contrato: string;

  @ApiProperty({})
  @IsInt()
  @IsPositive()
  horas_extras: number;

  @ApiProperty()
  @IsString()
  @MinLength(4) 
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha de inicio es incorrecta debe ser  YYYY-mm-dd',
  })
  ctr_fecha_inicio: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha de fin incorrecta debe ser YYYY-mm-dd',
  })
  ctr_fecha_fin: string;

  @ApiProperty()
  @IsString() 
  @IsOptional() 
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha de inicio es incorrecta debe ser  YYYY-mm-dd',
  })
  ctr_fecha_inicio_pro: string;
  
  @ApiProperty()
  @IsString() 
  @IsOptional() 
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha de fin incorrecta debe ser YYYY-mm-dd',
  })
  ctr_fecha_fin_pro: string;

  @ApiProperty()
  @IsUUID('all', { message: 'La empresa seleccionada no es valida' })
  marca_ctr_empre: string;
}
