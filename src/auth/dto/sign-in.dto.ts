import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}

export interface JwtPayload {
    sub: number;
    username: string;
  }