import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const {name, surname, email, avatar} = GqlExecutionContext.create(context).getContext().req.user;

        return {name, surname, email, avatar};
    },
)
