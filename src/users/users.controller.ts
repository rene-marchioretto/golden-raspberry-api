import { All, Controller, Get, Header, MethodNotAllowedException, Request } from '@nestjs/common';
import type { JwtPayload } from '../auth/dto/sign-in.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }): JwtPayload {
    return req.user;
  }

  @ApiExcludeEndpoint()
  @Header('Allow', 'GET')
  @All()
  notAllowed(): never {
    throw new MethodNotAllowedException();
  }
}