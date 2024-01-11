import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { FORMAT_FECHA_DD_MM_YYYY, FORMAT_FECHA_YYYY_MM_DD } from 'src/common/const';

export class CreateEmployeDto {
  @ApiProperty({})
  @IsString()
  @MinLength(4)
  emp_codigo: string;

  @ApiProperty()
  @IsString() 
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha es incorrecta debe ser dd/mm/YYYY',
  })
  emp_fecha_nacimiento: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  emp_nombres: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  emp_apellidos: string;

  @ApiProperty()
  @IsUUID('all', { message: 'La empresa es incorrecta' })
  marca_emp_empre: string;

  @ApiProperty()
  @IsUUID('all', { message: 'El género es incorrecto' })
  marca_emp_gen: string;

  @ApiProperty()
  @IsUUID('all', { message: 'La ubicación es incorrecta' })
  marca_emp_ubi: string;

  @ApiProperty()
  @IsUUID('all', { message: 'El tipo de contratación es incorrecta' })
  marca_emp_cn: string;


  @ApiProperty()
  @IsUUID('all', { message: 'El proyecto es incorrecto' })
  @IsOptional()
  marca_asig_proy: string;



  @ApiProperty()
  @IsUUID('all', { message: 'El horario es incorrecto' })
  @IsOptional()
  marca_asig_hour: string;



  @ApiProperty()
  @IsString() 
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha es incorrecta debe ser dd/mm/YYYY',
  })
  emp_fecha_pro_incio: string;



  @ApiProperty()
  @IsString() 
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha es incorrecta debe ser dd/mm/YYYY',
  })
  emp_fecha_pro_fin: string;
}
