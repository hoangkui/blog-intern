import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest so it never throws an error
  handleRequest(err, user, info) {
    return user;
  }
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
}
