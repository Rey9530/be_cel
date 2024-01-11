import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Codigo de usuario (unique)',
        nullable: false,
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    usr_codigo: string;

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    usr_nombres: string;
    

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    usr_apellidos: string;


    @ApiProperty({})
    @IsString()
    @MinLength(8)
    usr_contrasenia: string;

}
