import { BadRequestException, createParamDecorator } from '@nestjs/common';

/**
 * request 객체에서 요청한 company 를 가져오는 데코레이터
 */
export const RequestCompany = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();

  if (request.company === undefined) {
    throw new BadRequestException('request.company is undefined');
  }
  return request.company;
  // get company from request object
});
