import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString,
  IsUUID,
  Matches, 
} from 'class-validator';
import { FORMAT_FECHA_DD_MM_YYYY } from 'src/common/const';

export class CreatePermissionDto {
  @ApiProperty()
  @IsUUID('all', { message: 'El motivo es incorrecto' })
  per_codmop: string;
  
  @ApiProperty()
  @IsUUID('all', { message: 'El empleado es incorrecto' })
  per_codemp: string;


  @ApiProperty()
  @IsUUID('all', { message: 'El empleado reemplaso es incorrecto' })
  per_codemp_reemplazo: string;

  @ApiProperty()
  @IsString()
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha de inicio es incorrecta debe ser dd/mm/YYYY',
  })
  per_fecha_inicio: string;

  @ApiProperty()
  @IsString()
  @Matches(FORMAT_FECHA_DD_MM_YYYY, {
    message: 'La fecha fin es incorrecta debe ser dd/mm/YYYY',
  })
  per_fecha_fin: string;

  @ApiProperty()
  @IsString({ message: 'El comentario es requerido' }) 
  per_comentario: string;
} 