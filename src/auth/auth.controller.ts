import {
    Body,
    Controller,
    Get,
    Header,
    HttpCode,
    HttpStatus,
    MethodNotAllowedException,
    Post,
    Request,
  } from '@nestjs/common';
  
  import { AuthService } from './auth.service';
  import { SignInDto } from './dto/sign-in.dto';
  import type { JwtPayload } from './dto/sign-in.dto';
  import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
  import { Public } from './public.decorator';

  @ApiTags('auth')
  @ApiBearerAuth()
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
      return this.authService.signIn(signInDto.username, signInDto.password);
    }
  
    @Get('profile')
    getProfile(@Request() req: { user: JwtPayload }): JwtPayload {
      return req.user;
    }

    @ApiExcludeEndpoint()
    @Header('Allow', 'POST')
    notAllowedOnCollection(): never {
    throw new MethodNotAllowedException();
  }
}