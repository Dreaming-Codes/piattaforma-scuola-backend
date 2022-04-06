import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
