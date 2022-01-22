import { ExtractJwt, Strategy } from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const {name, email, avatar} = payload;
        return{
            name, email, avatar
        }
    }
}
