import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    console.log(request);
    if (data) {
      //@ts-ignore
      return request.user[data];
    }
    return request.user;
  },
);