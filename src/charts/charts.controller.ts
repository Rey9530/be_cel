import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/users/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';

@ApiTags('Charts')
@Controller('v1/charts')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) { }

  @Get('get/:id')
  getChartsContract(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chartsService.getChartsContract(id);
  }

  @Get('get/genders/:id')
  getChartsGenderContract(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chartsService.getChartsGenderContract(id);
  }

  @Get('get/contrations/:id')
  getChartsContrationContract(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chartsService.getChartsContrationContract(id);
  }
}
