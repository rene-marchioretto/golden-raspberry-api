import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'root',
      password: 'root',
    },
    {
      userId: 2,
      username: 'admin',
      password: 'admin',
    },
  ];

  findOne(username: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user) => user.username === username),
    );
  }
}