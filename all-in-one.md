## lib.es5.d.ts 분석

### filter, map 제네릭 분석

#### 타입 파라미터

- Generic type이 무엇인지 구체적으로 명시해줄때는 `<>`안에 타입(타입 파라미터)을 적는다.
- 타입스크립트가 타입을 추론하지 못할때, 위와 같이 명시한다.(아래 코드 참고)

```typescript
// 여기서 <T>는 제너릭타입
function add<T>(x: T, y: T): T {
  return x;
}

// 여기서 <number>는 타입 파라미터
add<number>(1, 2);
add("1", "2");
add(true, false);

<s>add(1, 2); // as구문의 형태로, 강제 타입 지정
```

#### 코드 분석

```typescript
// value is S => custom type guard
// S extends T => S는 T에 속해야한다(부분 집합이어야한다.)
every<S extends T>(predicate: (value:T, index: number, array: T[]) => value is S, thisArg?: any) : this is S[]

```

#### map, filter 분석

- 제너릭타입은 한 단어씩 타입을 대입하면서 찾아나간다.

```typescript
interface Array<T> {
  // U : callbackfn의 리턴값의 타입
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[];

  filter<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any
  ): S[];

  filter(
    predicate: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): T[];
}

// 여기서 U는 string
const strings = [1, 2, 3].map((item) => item.toString()); //['1','2','3'] string[]

// filter의 타이핑 자체가 extends로 되어있기 때문에 반환값은 배열 내 속성의 타입들로 구성된다.
const notPredicatedFiltered = ["1", 2, "3", 4, "5"].filter(
  (value) => typeof value === "string"
); // const notPredicatedFiltered: (string | number)[]

// 그래서 원하는 반환값의 타이핑에 맞춘 배열로 타이핑을 원한다면
// predicate처럼 매개변수 타입을 확정하여 구성된 변수를 filter인자에 넣어준다.
const predicate = (value: string | number): value is string =>
  typeof value === "string";
const filtered = ["1", 2, "3", 4, "5"].filter(predicate); // ['1','3','5'] string[]
```

### forEach 타입 직접 만들기

1. interface로 forEach를 void 함수 타이핑

```typescript
interface Arr {
  forEach(): void;
}
```

2. forEach의 콜백함수를 void 함수로 타이핑

```typescript
interface Arr {
  forEach(callbackFunc: () => void): void;
}
```

3. 콜백함수 인자를 `string | number`로 타이핑

```typescript
interface Arr {
  forEach(callbackFunc: (value: string | number) => void): void;
}
```

- 문제점 발생

```typescript
const arr: Arr = [1, 2, 3];
arr.forEach((val) => val.toString()); // val이 string|number로 추론이 되어, string 메서드 사용 불가
```

4. 타입을 자연스럽게 추론할 수 있도록, 제네릭 타이핑을 해준다.

```typescript
interface Arr<T> {
  forEach(callbackFunc: (value: T) => void): void;
}
```

### map 타입 직접 만들기

- map은 콜백의 매개변수값과 리턴값의 타입이 다른 경우가 있다.
- S라는 리턴 타입을 추가하여 타입을 구성하였다.
- S는 map의 최종 리턴 배열 내 속성 타입을 나타낸다.

```typescript
interface Arr<T> {
  forEach(callbackFunc: (value: T) => void): void;
  map<S>(callbackFunc: (value: T, i: number) => S): S[];
}
const arr: Arr<number> = [1, 2, 3];
arr.map((val, i) => +val);
```

### filter 타입 직접 만들기

- 커스텀 타입 가드(`is`) 사용 => 넓은 타입을 좁은 타입으로 좁혀주는 역할
- S타입을 T타입의 인스턴스화하여(`S extends T`), 커스텀 타입 가드 오류 해결

- 추가로 filter 구현시, 매개변수에 형식 조건자(커스텀 타입 가드)에 타입을 명시해줘야 완벽하게 타입을 추론한다. (`v is number`)

```typescript
interface Arr<T> {
  forEach(callbackFunc: (value: T) => void): void;
  map<S>(callbackFunc: (value: T) => S): S[];
  filter<S extends T>(callbackFunc: (value: T) => value is S): S[];
}
const arr: Arr<number> = [1, 2, 3];

const b = arr.filter((v): v is number => v % 2 === 0);
```

### 공변성과 반공변성

리턴값을 더 넓은 타입으로 대입되고, 매개변수는 더 좋은 타입으로 대입된다.

- 리턴값이 넓은 타입으로 대입되고, 매개변수는 좁은 타입으로 대입되는 예시

```typescript
function a(x: string | number): number {
  return 0;
}

type BB = (x: string) => number | string;
let bb: BB = a;
```

- 역으로 매개변수가 넓은 타입으로 대입되는 예시 (변수b 오류 발생)

```typescript
function a(x: string): number {
  return 0;
}

type B = (x: string | number) => number;
let b: B = a; //   'string | number' 형식은 'string' 형식에 할당할 수 없습니다. 'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2322)
```

### 오버로딩

- 타이핑을 한 번에 할 수 없을 때(각각의 경우에 맞춰 타이핑을 할 때), 타입들을 여러 번 선언할 수 있는 방법

```typescript
interface Addition {
  (x: number, y: number): number;
  (x: string, y: string): string;
}

const addition: Addition = (x: any, y: any) => x + y;
addition(1, 2); // any가 아닌 위의 타입 중 하나로 추론됨

// const addition: Addition
// (x: number, y: number) => number (+1 overload)
```

### 타입스크립트는 건망증이 심하다(+에러 처리법)

타입스크립트의 as는 일회성이다.
그러므로 타입을 강제로 변환했다면, 변환한 타입을 가진 값을 변수로 저장해서 사용한다.

아래 코드 설명

- 자바스크립트로 변환시에도 남아있으면서도 인터페이스랑 비슷한 역할을 해주는 것이 class이므로, class를 사용하여 타입 확장하고, `instanceof` 를 사용할 수 있다.
- 만약 CustomError를 interface로 선언하면, 자바스크립트로 변환시 해당 코드가 사라져, 아래에서 `instanceof` 타입가드를 사용하지 못한다.

```typescript
interface Axios {
  get(): void;
}

class CustomError extends Error {
  response?: {
    data: any;
  };
}

declare const axios: Axios;
(async () => {
  try {
    await axios.get();
  } catch (err) {
    // type guard로 좁힌다.
    if (err instanceof CustomError) {
      const customError = err;
      customError.response?.data;
    }
  }
})();
```
