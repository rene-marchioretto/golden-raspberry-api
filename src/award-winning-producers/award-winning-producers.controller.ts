import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwardWinningProducersService } from './award-winning-producers.service';
import { CreateAwardWinningProducerDto } from './dto/create-award-winning-producer.dto';
import { UpdateAwardWinningProducerDto } from './dto/update-award-winning-producer.dto';

@Controller('award-winning-producers')
export class AwardWinningProducersController {
  constructor(private readonly awardWinningProducersService: AwardWinningProducersService) {}

  @Post()
  create(@Body() createAwardWinningProducerDto: CreateAwardWinningProducerDto) {
    return this.awardWinningProducersService.create(createAwardWinningProducerDto);
  }

  @Get()
  findAll() {
    return this.awardWinningProducersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awardWinningProducersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAwardWinningProducerDto: UpdateAwardWinningProducerDto) {
    return this.awardWinningProducersService.update(+id, updateAwardWinningProducerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awardWinningProducersService.remove(+id);
  }
}
