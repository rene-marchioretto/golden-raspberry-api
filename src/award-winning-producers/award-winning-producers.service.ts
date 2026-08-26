import { Injectable } from '@nestjs/common';
import { CreateAwardWinningProducerDto } from './dto/create-award-winning-producer.dto';
import { UpdateAwardWinningProducerDto } from './dto/update-award-winning-producer.dto';

@Injectable()
export class AwardWinningProducersService {
  create(createAwardWinningProducerDto: CreateAwardWinningProducerDto) {
    return 'This action adds a new awardWinningProducer';
  }

  findAll() {
    return `This action returns all awardWinningProducers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} awardWinningProducer`;
  }

  update(id: number, updateAwardWinningProducerDto: UpdateAwardWinningProducerDto) {
    return `This action updates a #${id} awardWinningProducer`;
  }

  remove(id: number) {
    return `This action removes a #${id} awardWinningProducer`;
  }
}
