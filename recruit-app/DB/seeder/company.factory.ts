import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

export default async () => {
  const industries = [
    '기술',
    '금융',
    '의료',
    '교육',
    '소매',
    '제조업',
    '부동산',
    '운송',
    '엔터테인먼트',
    '에너지',
  ];

  return {
    companyId: nanoid(),
    companyName: faker.company.name(),
    country: faker.location.country(),
    region: faker.location.city(),
    industry: faker.helpers.arrayElement(industries),
  };
};
