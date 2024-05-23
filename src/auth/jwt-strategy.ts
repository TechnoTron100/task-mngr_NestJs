import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repositroy";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.usersRepository.findOne({ where: { username: username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
