import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";



export class CreateScheduleDto {

    @ApiProperty({})
    @IsArray()
    list: [];
}