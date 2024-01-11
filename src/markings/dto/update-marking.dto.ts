import { PartialType } from '@nestjs/mapped-types';
import { CreateMarkingDto } from './create-marking.dto';

export class UpdateMarkingDto extends PartialType(CreateMarkingDto) {}
