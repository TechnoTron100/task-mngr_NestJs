import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repositroy';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) { }

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.createUser(authCredentialsDTO);
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;
    const user = await this.userRepository.findOne({ where: { username: username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    }
    else {
      throw new UnauthorizedException('Please, check your login credentials');
    }
  }
}
