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

## React 타입 분석

### UMD 모듈과 tsconfig.json jsx 설정하기

Reat의 index.d.ts를 보면
`export = React;`로 되어있음  
즉,React 는 common.js로 이루어진 라이브러리이다.

그럼 `import * as React from "react";`
혹은 `import React = require("react");`로 가져와야하지만, </br>
` tsconfig.json`에서 `esMudleInterop:true`로 설정하면 </br>
`import React from "react";`로 가져올 수 있다.

`export as namespace React;`까지 있으면 UMD 모듈

### 함수 컴포넌트(FC vs VFC), Props 타이핑

React17 -> React18 update시, children이 없다는 경고 문구를 볼 수 있는데, 이는 `FunctionComponent`에서 더이상 children을 props에 지원하지 않기 때문이다.
React17에서는 `VoidFunctionCompnent`에서만 children 지원을 안했지만, React18은 모든 FC 및 VFC 모두 다 children 타입을 지원하지 않기 때문에, VFC가 없어졌다.
그래서 만약 props에 children을 사용하고자 한다면,
아래와 같이 ReactNode 타입으로 선언하면 된다. 해당 children 을 선택 속성으로 설정하고자한다면, undefined도 추가한다.

```typescript
interface P {
  name: string;
  children?: ReactNode | undefined;
}
```

### useState, useEffect 타이핑

#### useState

초기값으로 `initialState: S | (() => S)` 변수 혹은 함수를 lazy init 할 수 있다.

```typescript
function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
```

```typescript
// lazy init
const [state, setState] = useState(()=>return 복잡한 함수)
```

lazy init : 초기값이 복잡한 함수일때, 리렌더링 되어도 최초 한 번만 호출이 되고 이후에는 호출되지 않도록 하는 기법

#### useEffect

타입스크립트에서 useEffect는 void함수를 리턴하기 때문에, Promise void를 리턴하는 async함수를 붙여서 바로 쓸 수 없고, useEffect 내부에 비동기 함수 선언 후, 호출을 통해 구현할 수 있다.

```typescript
// error
useEffect(async () => {
  await axios.post();
}, []);

// success
useEffect(() => {
  const post = async () => {
    await axois.post();
  };
  post();
}, []);
```

### 브랜딩 기법

새로운 타입(가상의 속성)을 만드는 기법이다.
실제로 존재하지 않는 타입이기 때에에, 강제 타입을 지정한다.

```typescript
type Brand<K, T> = K & { _brand: T };

type EUR = Brand<number, "EURO">;
type USD = Brand<number, "USD">;
type KRW = Brand<number, "KR">;

const usd = 10 as USD;
const eur = 10 as EUR;
const krw = 200 as KRW;
function euroToUsd(euro: EUR): number {
  return euro * 1.18;
}
euroToUsd(eur);
```

남의 타입을 많이 보면서 새로운 타입들을 학습하자!

### useCallback, useRef 타이핑

#### useCallback

React18부터는 useCallback의 인자에 자동으로 any 타입이 지정되지 않기 때문에, 타이핑을 직접 해주어야한다.

#### useRef

React는 3가지의 useRef 타입을 제공해준다.

```typescript
// 1
function useRef<T>(initialValue: T): MutableRefObject<T>;
// 2
function useRef<T>(initialValue: T | null): RefObject<T>;
// 3
function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```

1의 MutableRefObject타입은 HTML에 값을 저장하는 타입이 아닌, 컴포넌트에 값을 저장하는 타입이다.

```typescript
const mutaRef = useRef(0);

useEffect(() => {
  mutaRef.current += 1;
}, []);
```

2의 타입이 아래와 같이 HTML에 연결할 목적으로 만들어지는 ref이다. 2 타입에 걸리기 위해서 null까지 꼭 넣어줘야한다.

```typescript
const inputEl = useRef<HTMLInputElement>(null)

.
.
<input ref = {inputEl.current}/>
```

- useState : 화면을 리렌더링 시킨다. (값 저장 O)
- useRef : 화면을 리렌더링 시키지 않는다. (값 저장 O)

### class 컴포넌트 타이핑

namespace는 script태그로 불러올때 주로 쓰인다.
namespace도 겹치면 interface처럼 합쳐진다.
class형 컴포넌트는 리턴 타입이 ReactNode이고, 함수형 컴포넌트는 리턴 타입이 ReactElement이다.
이러한 이유로, 클래스형 컴포넌트에서는 문자도 jsx에 넣을 수 있지만, 함수형 컴포넌트에서는 문자를 리턴한 태그를 넣지 못한다.

```typescript
// index.d.ts 에서 class 타입
.
.

  render(): ReactNode;
  .
  .
     type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

```

```typescript
// 함수형 컴포넌트에서 안되는 경우
const A = () => {
  return "hi";
};
return (
  <div>
    <A /> // error : 함수형에서는 string 리턴 못함
  </div>
);
```

## Redux 타입 분석

Redux : 상태를 절차적으로 바꾸어주는 라이브러리이다.

### named exports만 있는 Redux 알아보기

선언하는 기능명과 가져오는 기능명이 같도록 하는 방식을 named exports라고 한다.
redux 타입을 보면 export default가 없고 named exports만 있다.
그래서 아래와 같이, import해온다.

```typescript
import { compose, legacy_createStore as createStore } from "redux";
```

#### combineReducers 톺아보기

```typescript
// S는 initialState
export function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<CombinedState<S>, A>;

// initialState 내 값들의 키와 액션으로 이루어짐
export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;
```

#### 위의 코드들을 분석을 위해 합쳐보자

```typescript
export function combineReducers<S, A extends Action = AnyAction>(
   [K in keyof S]: (
  state: S[K]| undefined,
  action: A
) => S[K];
):
```

```typescript
import {
  compose,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";

const initialState = {
  // user, posts => keyof S
  user: {
    // isLogginIn, data => S[K]
    isLogginIn: false,
    data: null,
  },
  posts: [],
};

const reducer = combineReducers({
  user: (state, action) => {},
  posts: (state, action) => {},
});
const store = createStore(reducer, initialState);
```

### action, reducer 타이핑하기

액션에 들어가는 데이터를 동적으로 만들어내기 위해 보통 함수로 만들어서 dispatch한다.

```typescript
store.dispatch(
  logIn({
    id: 1,
    name: "zerocho",
    admin: true,
  })
);
```

### thunk 미들웨어 타이핑하기

원래 action은 객체인데, thunk를 통해 함수형태로 action을 구성할 수 있다.
그래서 아래와 같이, action이 함수이면 해당 함수를 (비동기 혹은 동기 등 자유롭게) action을 요청할 수 있다.

```typescript
export const logIn = (data) => {
  // async action creator
  return (dispatch, getState) => {
    // async action
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(
          logInSuccess({
            userId: 1,
            nickname: "zerocho",
          })
        );
      }, 2000);
    } catch (e) {
      dispatch(logInFailure(e));
    }
  };
};
```

## Node, Express 타입 분석

### types/node

```typescript
declare module "fs"{
  ...
}
```

- decalre module... 형태를 앰비언트(abient) 모듈이라고 부른다.
- 타입 선언만 있고 구현이 없는 것을 앰비언트라고 한다.

### d.ts에서의 declare global

- 함수를 먼저 검사해서 내가 쓸 수 있는 메서드들을 찾아낸다.
- Error 타입을 사용하고자하는데, 특정 타입이 없으면 interface로 추가한다.
- 충돌이 발생하면 declare global로 해결한다.

```typescript
declare global {
  interface Error {
    status: number;
  }
}

// use함수에서 error 관련 쓸 수 있는 타입을 찾는다.

const errorMiddleware: ErrorRequestHandler = (err: Error, req, res, next) => {
  //err에는 status가 없어서 interface로 타입 추가한다.
  // 이때, decalre global로 충돌 해결
  console.log(err.status);
};

app.use(errorMiddleware);
```

그러나 보통 타입 지정은 `types.d.ts`에서 한다.
declare global은 모듈 시스템이어야하므로, 임의의 import 문 혹은 export 문을 추가한다.
(공식문서에서 **declare global은 모듈안에 있어야한다**는 내용을 참고)

- export 문이 없면면 자바스크립트는 모듈이 아닌 스크립트파일로 읽어냄

```typescript
// types.d.ts

declare global {
  interface Error {
    status: number;
  }
}

// 임의의 export 문
export {};
```

```typescript
// types.d.ts
// 혹은 declare global을 빼도 됨

interface Error {
  status: number;
}
```

### passport에서 req.user 타이핑하기

```typescript
// express.ts
// user에 zerocho를 추가하고자 한다.
req.user?.zerocho;
```

- 위와 같이 특정 타입을 추가하기 위해, `types.d.ts`에 해당 자리에 타입을 추가한다.

```typescript
// types.d.ts
declare global {
  interface Error {
    status: number;
  }

  namespace Express {
    export interface User {
      zerocho: string;
    }
  }
}

export {};
```

## 직접 라이브러리 타이핑하기

### react-native-keyboard-aware-scrollview 직접 타이핑하기

- 비슷한 기능의 타이핑된 모듈들을 분석 및 차용하여 직접 타이핑을 한다.

```typescript
// react-native-keyboard-aware-scrollview.d.d.ts
// declare module을 통해 해당 모듈의 타입을 우리가 직접 지정
declare module "react-native-keyboard-aware-scrollview" {
  import * as React from "react";
  class KeyboardAwareScrollViewComponent extends React.Component<ViewProps> {}
  export class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export { KeyboardAwareScrollView };
}
```

### connect-flash 직접 타이핑하기

- 따로 connect-flash설치없이, d.ts 파일로 모듈 타이핑을 한다.
- cookie-parser 모듈을 참조하여 middleware 타이핑 추가
- named import(express.ts에서 Request)와 default import(express.ts에서 flash) 구분하여 타이핑

```typescript
declare module "connect-flash" {
  global {
    namespace Express {
      interface Request {
        flash(message: string): void;
        flash(event: string, message: string): void;
        flash(): { [key: string]: string[] };
      }
    }
  }
  import express = require("express");
  function flash(): express.RequestHandler;
  export default flash;
}
```
