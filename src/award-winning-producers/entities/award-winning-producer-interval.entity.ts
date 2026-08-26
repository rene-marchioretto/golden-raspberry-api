import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type AwardWinningProducerIntervalKind = 'min' | 'max';

export interface AwardWinningProducerIntervalProps {
  kind: AwardWinningProducerIntervalKind;
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

@Entity({ name: 'award_winning_producers_watchlist' })
@Index(['kind', 'interval'])
export class AwardWinningProducerIntervalEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  kind!: AwardWinningProducerIntervalKind;

  @Column({ type: 'text' })
  producer!: string;

  @Column({ type: 'integer' })
  interval!: number;

  @Column({ type: 'integer' })
  previousWin!: number;

  @Column({ type: 'integer' })
  followingWin!: number;

  static create(
    props: AwardWinningProducerIntervalProps,
  ): AwardWinningProducerIntervalEntity {
    return new AwardWinningProducerIntervalEntity().update(props);
  }

  update(props: AwardWinningProducerIntervalProps): this {
    this.kind = props.kind;
    this.producer = props.producer;
    this.interval = props.interval;
    this.previousWin = props.previousWin;
    this.followingWin = props.followingWin;

    return this;
  }
}
