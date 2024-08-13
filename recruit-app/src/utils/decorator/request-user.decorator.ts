import { BadRequestException, createParamDecorator } from '@nestjs/common';

/**
 * request 객체에서 요청한 user 를 가져오는 데코레이터
 */
export const RequestUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();

  if (request.user === undefined) {
    throw new BadRequestException('request.company is undefined');
  }
  return request.user;
});
