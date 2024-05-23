import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) { }

  @Post('/signup')
  signUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authServices.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
    return this.authServices.signIn(authCredentialsDTO);
  }
}
