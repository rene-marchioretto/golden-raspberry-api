import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface MovieEntityProps {
  year: number;
  title: string;
  studios: string;
  producers: string[];
  winner: boolean;
}

export type MovieEntityPatch = Partial<MovieEntityProps>;

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  year!: number;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  studios!: string;

  @Column({ type: 'simple-json' })
  producers!: string[];

  @Column({ type: 'boolean' })
  winner!: boolean;

  static create(props: MovieEntityProps): MovieEntity {
    return new MovieEntity().update(props);
  }

  update(props: MovieEntityProps): this {
    this.year = props.year;
    this.title = props.title;
    this.studios = props.studios;
    this.producers = [...props.producers];
    this.winner = props.winner;

    return this;
  }

  patch(props: MovieEntityPatch): this {
    if (props.year !== undefined) {
      this.year = props.year;
    }

    if (props.title !== undefined) {
      this.title = props.title;
    }

    if (props.studios !== undefined) {
      this.studios = props.studios;
    }

    if (props.producers !== undefined) {
      this.producers = [...props.producers];
    }

    if (props.winner !== undefined) {
      this.winner = props.winner;
    }

    return this;
  }
}