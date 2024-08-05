import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 50;

// keyword 길이 체크하는 pipe
@Injectable()
export class KeywordPipe implements PipeTransform {
  transform(keyword: string) {
    if (
      keyword &&
      (keyword.length < MIN_SEARCH_LENGTH || keyword.length > MAX_SEARCH_LENGTH)
    ) {
      throw new BadRequestException('검색어는 2자 이상 50자 이하여야 합니다.');
    }
    return keyword;
  }
}
