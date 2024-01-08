import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, Matches } from "class-validator";
import { FORMAT_FECHA_DD_MM_YYYY } from "src/common/const";

export class FilterDTO {
    @ApiProperty()
    @IsString()
    @MinLength(10, { message: 'La longitud no es validad' })
    @Matches(FORMAT_FECHA_DD_MM_YYYY,
        {
            message: 'La fecha de inicio es incorrecta debe ser dd/mm/YYYY',
        }
    )
    date_start: string;


    @ApiProperty({})
    @IsString()
    @MinLength(10, { message: 'La longitud no es validad' })
    @Matches(FORMAT_FECHA_DD_MM_YYYY,
        {
            message: 'La fecha fin es incorrecta debe ser dd/mm/YYYY',
        }
    )
    date_end: string;

}
