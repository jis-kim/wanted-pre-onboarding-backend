import { BadRequestException, NotFoundException } from '@nestjs/common';
import { KeywordPipe } from './keyword.pipe';

describe('KeywordPipe', () => {
  it('should be defined', () => {
    expect(new KeywordPipe()).toBeDefined();
  });

  it('should return keyword when it is valid', () => {
    const pipe = new KeywordPipe();
    const keyword = 'test';
    expect(pipe.transform(keyword)).toBe(keyword);
  });

  it('should throw an error when keyword is too short', () => {
    const pipe = new KeywordPipe();
    const keyword = 't';
    expect(() => pipe.transform(keyword)).toThrow(BadRequestException);
  });

  it('should throw an error when keyword is too long', () => {
    const pipe = new KeywordPipe();
    const keyword = 't'.repeat(51);
    expect(() => pipe.transform(keyword)).toThrow(BadRequestException);
  });
});
