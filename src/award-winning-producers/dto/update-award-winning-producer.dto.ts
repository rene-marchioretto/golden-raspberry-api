import { PartialType } from '@nestjs/mapped-types';
import { CreateAwardWinningProducerDto } from './create-award-winning-producer.dto';

export class UpdateAwardWinningProducerDto extends PartialType(CreateAwardWinningProducerDto) {}
