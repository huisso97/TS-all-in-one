# Part2. 실전 분석편

## 인트로

### 타입 지원 여부 파악하기

- `TS` : npm 사이트에서 검색된 라이브러리 이름 옆에 `TS`가 붙어있으면, 기본적으로 타입스크립트를 지원하기 때문에, 타이핑이 다 되어있다.
- `DT` : 해당 라이브러리에 대해 오픈소스형태로 타입형 라이브러리가 있음을 알려주는 키워드이다.
- 아무 키워드도 없다면, 해당 라이브러리에 대한 타이핑 지원이 없다는 의미로, 우리가 직접 타입을 만들어줘야한다.

## 제이쿼리 타입 분석

### 환경 세팅

1. `npm i jquery`
2. `npm i -D @types/jquery` -> 제이쿼리 타이핑을 위해 추가 설치(개발자 환경)

### reference 종류

- types : npm 라이브러리
- path : 현재 라이브러리 파일
- lib : TS 기본 제공 라이브러리

### esmodile과 commonjs

```typescript
export default $; // esmodule
export = $; // commonjs
```

### 타입스크립트에서 첫번째 매개변수로 this가 있으면, 없는것과 동일하다.

해당 매개변수는 실제 매개변수가 아니라, this를 타이핑해주는 역할일 뿐이다.

```typescript
   removeClass(className_function?: JQuery.TypeOrArray<string> | ((this: TElement, index: number, className: string) => string)): this;
```

### 인수는 생략할 수 없지만, 매겨변수는 생략할 수 있다.

```typescript
$tag.html(function (index, oldHtml) {
  return "<div>hello</div>";
});
// 안쓰는 매개변수는 생략이 가능하다.
$tag.html(function () {
  return "<div>hello</div>";
});
function add(x: string, y: string): string {
  return x + y;
}
// 인수는 무조건 정해진대로 넣어줘야한다
add("1", "2");
```

## Axios 타입 분석

타입 분석을 할 때는 위에서 아래가 아닌, 아래에서(export) 위로 분석을 해야한다.
axios = fetch + 여러 기능
브라우저와 노드, 리액트 네이티브 모든 환경에서 다 돌아간다.

### ts 파일 노드로 실행하는 방법

#### 로컬로 테스트

`npx ts-node 파일명`

#### 글로벌로 테스트

`npm i -g ts-node`
`ts-node 파일명`

#### 결과

```bash
$ ts-node axios.ts
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}

```

### axios 타이핑하기

```typescript
import axios, { AxiosError, AxiosResponse, CreateAxiosDefaults } from "axios";
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
interface Created {}
interface Data {
  title: string;
  body: string;
  userId: number;
}

(async () => {
  try {
    const res = await axios.get<Post, AxiosResponse<Post>>(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    // post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    // 제네릭 순서 -> 반환값 타입 매개변수 타입
    const postRes = await axios.post<Created, AxiosResponse<Created>, Data>(
      "https://jsonplaceholder.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );
    console.log(res.data);
  } catch (err) {}
})();
```

### unknown 값에 타이핑하기

타입스크립트는 err를 unknown으로 인식하기 때문에, as로 타이핑을 하고, as 타이핑 후에도 타입스크립트는 해당 값에 대한 타입 기억을 못하기 때문에, 아래와 같이 변수에 저장해서 사용한다.

```typescript
(async () => {
  try {
    const res = await axios.get<Post, AxiosResponse<Post>>(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    const postRes = await axios.post<Created, AxiosResponse<Created>, Data>(
      "https://jsonplaceholder.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );
  } catch (err) {
    const errResponse = (err as AxiosError).response;
    console.log(errResponse?.data);
  }
})();
```

### 커스텀 타입 가드

위와 같이 에러를 처리했을 때, axios 에러 외에는 캐치에 오지 못해 에러를 발생시키는 문제점이 생긴다.
err를 넓은 범위로 사용하되, axios 에러에 대한 예외 처리를 하고자 한다면,
커스텀 타입가드를 사용하여 처리한다.
이때, 커스텀 타입 가드로 통과한 err는 deps를 들어가면 해당 값이 다시 unknown으로 반환되기 때문에, 이 부분은 2번째 타입가드 코드와 같이 강제로 타입을 부여해주는 방식이 있다.

```typescript
.
.
.
  } catch (err) {
    // 1번째 커스텀 타입 가드
    if (err instanceof AxiosError) {
      err.response;
    }
    // 2번째 타입가드
    if (axios.isAxiosError(err)) {
      console.error(
        (err.response as AxiosResponse<{ message: string }>)?.data.message
      );
    }
  }
  .
  .
```

### axios 타입 직접 만들기

interface에는 axios로 구현할 수 있는 방법들을 적용하여 구현한다.
선택 타입은 필수 타입 앞에 올 수 없다.
그래서 선택 타입 뒤에 필수 타입을 매개변수로 쓸 시, 뒤에오는 필수 타입(아래의 A interface의 D)은 any로 고정하여 처리한다.

```typescript

interface Config<D = any> {
  method?: "post" | "get" | "patch" | "delete" | "head" | "options";
  url?: string;
  data?: D;
}

// get, post, 객체가 들어간 함수, 주소, 객체가 들어간 함수, axiosERror
interface A {
  // 제네릭에는 변수(T,R)로 저장해서 구현한다.
  get: <T = any, R = AxiosResponse<T>>(url: string) => Promise<R>;
  post: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data: D
  ) => Promise<R>;
  isAxiosError: (error: unknown) => error is AxiosError;
  (config: Config): void;
  (url: string, config: Config): void;
}

const typedAxios: A = axios;

async () => {
  try {
  const res = await typedAxios.get(
    "https://jsonplaceholder.tvpicode.com/posts/1"
  );
  const postRes = await typedAxios.post(
    "https://jsonplaceholder.tvpicode.com/posts/1",
    "data"
  );
  } catch (err) {
    if (typedAxios.isAxiosError(err))
  }
};

```
