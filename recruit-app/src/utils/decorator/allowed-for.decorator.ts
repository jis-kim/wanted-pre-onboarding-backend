import { CustomDecorator, SetMetadata } from '@nestjs/common';

export enum Role {
  USER = 'user',
  COMPANY = 'company',
}

export const AllowedFor = (role: Role): CustomDecorator<string> => {
  return SetMetadata('role', role);
};
