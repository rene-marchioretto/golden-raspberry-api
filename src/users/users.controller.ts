import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
    import type { JwtPayload } from '../auth/dto/sign-in.dto';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }): JwtPayload {
    return req.user;
  }
}