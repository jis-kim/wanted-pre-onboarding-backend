# wanted-pre-onboarding-backend

프리온보딩 백엔드 인턴십 선발과제

# 사용 기술

- Node.js
- TypeScript
- NestJS
- TypeORM
- PostgreSQL

# 실행 방법

## 사전 설정

`env.sample` 파일을 복사하여 루트 디렉토리에 `.env` 파일을 생성하고, 필요한 환경변수를 설정합니다.

### 환경 변수 설명

```bash
# DB 에 접속하기 위한 환경변수 설정

# 연결할 DB의 포트 번호
POSTGRES_PORT=
# 연결할 DB의 호스트 주소
POSTGRES_HOST=
# 연결할 DB의 이름
POSTGRES_DB=
# 연결할 DB의 사용자명
POSTGRES_USER=
# 연결할 DB의 사용자 비밀번호
POSTGRES_PASSWORD=
```

## 설치

- `cd ./recruit-app && pnpm install` 실행

## DB container 생성

- `pnpm run db` 실행
- `.env` 파일에 설정한 환경변수를 이용하여 postgres container 를 생성합니다.
- docker, docker compose 가 설치되어 있지 않다면 `.env` 를 로컬 환경에 맞게 수정하여 실행 합니다.

## seeding data 생성

- recruit-app 에서 `pnpm run seed` 또는 `npx ts-node ./DB/data-source.ts` 실행
- 한 번 실행 당 10명의 user, 10개의 company가 생성됩니다.

## 실행

- `pnpm run build && pnpm run start:prod` 실행

## 테스트

- `pnpm run test` 실행

# ERD

- ![img](./asset/recruit-erd.png)

# API list

- [issue list 참고](https://github.com/jis-kim/wanted-pre-onboarding-backend/issues)

## jobs

### GET `/jobs?keyword=`

- issue [#5](../../issues/5)
- issue [#8](../../issues/8)

#### Description

keyword 가 있으면 해당 키워드를 포함하는 채용공고를 검색합니다. 없으면 전체 채용공고를 검색합니다.

#### Request

##### query

- keyword: string
  - 검색 키워드
  - 2글자 이상, 50글자 이하
  - src/jobs/pipe/keyword-validation.pipe.ts 에서 유효성 검사

#### Response

##### status code

- 200, 400
- 결과가 없을 경우에는 빈 배열을 반환.

##### body

```
{
  total?: number; // 전체 채용공고 개수
  jobs:
  {
    jobId: string;
    position: string;
    skills: string;
    country: string;
    region: string;
    dueDate: Date;
    companyId: string;
    companyName: string;
  }[];
}
```

### POST `/jobs`

- issue [#2](../../issues/2)

#### Description

request body 기반으로 채용 공고를 생성하고 생성된 채용공고에 접근할 수 있는 path를 Location 헤더에 담아 반환합니다.

#### Request

##### header

- x-company-id: string
  - job 생성을 요청한 company의 id

##### body

```
{
  position: string;
  skills: string;
  rewards: string;
  description: string;
  country: string;
  region: string;
  dueDate: Date; // ISO 8601
}
```

#### Response

##### status code

- 201, 400, 403

##### header

- Location: string
  - 생성된 채용공고에 접근할 수 있는 path
  - `/jobs/:jodId`

##### body

```
{
  message: string;
  jobId: string;
}
```

### GET `/jobs/:job_id`

- issue [#6](../../issues/6)

#### Description

job_id에 해당하는 채용공고의 자세한 정보를 반환합니다.

#### Request

##### param

- job_id
  - 조회할 채용공고의 id

#### Response

##### status code

- 200, 400, 404

##### body

```
{
  jobId: string;
  position: string;
  skills: string;
  reward: string;
  description: string;
  country: string;
  region: string;
  dueDate: Date;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  company: {
    companyId: string;
    companyName: string;
    jobs : { // 회사가 등록한 다른 채용공고 리스트
      jobId: string;
      position: string;
    }[];
  }
}
```

### PATCH `/jobs/:job_id`

- issue [#3](../../issues/3)

#### Description

job_id에 해당하는 채용공고의 정보를 수정합니다.

#### Request

##### param

- job_id
  - 수정할 채용공고의 id

##### body

- POST `/jobs/:job_id`의 Partial type

```
{
  position: string;
  skills: string;
  rewards: string;
  description: string;
  country: string;
  region: string;
  dueDate: Date; // ISO 8601
}
```

#### Response

##### status code

- 200, 400, 403, 404

##### body

```
{
  message: string;
  jobId: string;
}
```

### DELETE `/jobs/:job_id`

- issue [#4](../../issues/4)

#### Description

job_id에 해당하는 채용공고를 삭제합니다.

#### Request

##### param

- job_id
  - 삭제할 채용공고의 id

#### Response

##### status code

- 200, 400, 403, 404

##### body

```
{
  message: string;
}
```

## applications

### POST `/applications`

- issue [#7](../../issues/7)

#### Description

request body 기반으로 지원서를 생성하고 생성된 지원서에 접근할 수 있는 path를 Location 헤더에 담아 반환합니다.

#### Request

##### header

- x-user-id: string
  - 지원서를 생성한 user의 id

##### body

```
{
  jobId: string;
  title: string;
  content: string;
}
```

#### Response

##### status code

- 201, 400, 403

##### header

- Location: string
  - 생성된 지원서에 접근할 수 있는 path
  - `/applications/:application_id`

##### body

```
{
  message: string;
  applicationId: string;
}
```

### GET `/applications`

- issue [#9](../../issues/9)

#### Description

user_id에 해당하는 user가 지원한 지원서 리스트를 반환합니다.

#### Request

##### header

- x-user-id: string
  - 지원서를 조회할 user의 id

#### Response

##### success status code

- 200, 400, 403

##### body

```
{
  total?: number; // 전체 지원서 개수
  applications:
  {
    applicationId: string;
    userId: string;
    title: string;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    job: {
      jobId: string;
      position: string;
      company: {
        companyId: string;
        companyName: string;
      }
    }
  }[];
}
```
