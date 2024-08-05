import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

export default async () => {
  return {
    userId: nanoid(),
    userName: faker.person.fullName(),
    email: faker.internet.email(),
    phoneNumber: faker.string.numeric({ length: { min: 10, max: 20 } }),
    password: faker.internet.password(),
  };
};
