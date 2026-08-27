export class AwardWinningProducerIntervalDto {
    producer!: string;
    interval!: number;
    previousWin!: number;
    followingWin!: number;
  }
  
  export class AwardWinningProducerIntervalsResponseDto {
    min!: AwardWinningProducerIntervalDto[];
    max!: AwardWinningProducerIntervalDto[];
  }

export interface ProducerWinInterval {
    producer: string;
    interval: number;
    previousWin: number;
    followingWin: number;
  }