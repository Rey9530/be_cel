import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, Matches, IsEnum } from "class-validator";
import { FORMAT_FECHA_DD_MM_YYYY } from "src/common/const";

export enum Status {
    APROBADO = "APROBADO", 
    RECHAZADO = "RECHAZADO"
}
export class StatusDTO { 

    @ApiProperty({})
    @IsString()
    @IsEnum(Status, { message: 'El status debe ser APROBADO o RECHAZADO ' }) 
    status: Status;

}