import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const {_id, name, surname, email, avatar, role} = GqlExecutionContext.create(context).getContext().req.user;

        return {_id, name, surname, email, avatar, role};
    },
)
