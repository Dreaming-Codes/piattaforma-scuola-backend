import {ExecutionContext, Injectable} from '@nestjs/common';
import {GqlExecutionContext} from "@nestjs/graphql";
import {JwtGuard} from "./jwt.guard";
import {Observable} from "rxjs";

@Injectable()
export class JwtGraphqlGuard extends JwtGuard {
    getRequest(context: ExecutionContext){
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
