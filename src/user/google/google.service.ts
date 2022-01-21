import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
    googleLogin(req){
        return Boolean(req.user);
    }
}
