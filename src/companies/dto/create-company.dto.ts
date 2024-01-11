import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID, MinLength } from "class-validator";

export class CreateCompanyDto {


    @ApiProperty({})
    @IsString()
    @MinLength(1)
    
    empre_nombre: string;

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    empre_direccion: string; 
  
    @ApiProperty({})
    @IsString()
    @MinLength(1)
    empre_contacto_nombre: string;

    @ApiProperty({})
    @IsEmail({},{message:"El correo debe ser un correo valido"})
    @MinLength(1)
    empre_contacto_correo: string;

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    empre_contacto_telefono: string;

}
