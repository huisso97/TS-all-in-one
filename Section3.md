## Utility Types

### Partial 타입 분석 (interface에 적용)

Partial 타입은 필수 속성값들을 optional로 바꾸어주는 유틸리티 타입이다.
`[Key in keyof T]` : 어떤 객체가 오던지 그 객체의 키를 쓴다는 의미.

- Partial 구현하기

```typescript
interface Profile {
  name: string;
  age: number;
  married: boolean;
}
// value 타입을 가져오는 방법
type Name = Profile["name"];

type Partial<T> = {
  // ? 연산자로 옵셔널하게 지정
  [Key in keyof T]?: T[Key];
};

const newI: Partial<Profile> = {
  name: "hui",
  age: 26,
};
```

### Pick 타입 분석 (interface에 적용)

Pick 타입은 대상 타입에서 특정 속성들을 선별해서 사용하고자 할 때 사용한다.

- Pick 구현하기
  두번째 제네릭, S는 선별할 속성들이다.
  해당 속성들은 T에 종속되기 때문에, extends 구문으로 S의 범위를 Td의 key들로 제한 조건을 걸어준다.

```typescript
interface Profile {
  name: string;
  age: number;
  married: boolean;
}

type Pick<T, S extends keyof T> = {
  [Key in S]: T[Key];
};

const newI: Pick<Profile, "name" | "age"> = {
  name: "hui",
  age: 27,
};
```

### Omit, Exclude, Extract 타입 분석

Omit 타입은 대상 타입에서 특정 프로퍼티들을 제외하고 사용하고자 할 때 사용한다.

#### Omit (interface에 적용)

Pick 과 Exclude 유틸리티 타입을 조합하여 이루어진 타입으로, 타입에서 특정 프로퍼티들을 제외한 타입을 만들때 사용한다.

- Omit 구현하기
  `S extends keyof any` : S에는 프로퍼티들만 넣을 수 있도록 제약을 걸음, 만약 S만 있다면 해당 자리에 타입을 넣을수도 있는 예외사항을 배제하기 위함(해당 자리는 string | number | symbol만 가능)

```typescript
type Omit<T, S extends keyof any> = Pick<T, Exclude<keyof T, S>>;

// 위의 `S extends keyof any` 제약 덕분에, 아래의 두번째 제네릭 Profile에서 오류 발생(해당 자리는 string | number | symbol만 가능)
const newI: Omit<Profile, Profile> = {
  name: "hui",
  age: 24,
};

// success
const newI: Omit<Profile, "married"> = {
  name: "hui",
  age: 24,
};
```

#### Exclude (key들에 적용)

타입에서 특정 키만 빼고자 할 때 사용한다.

```typescript
type Animal = "Cat" | "Dog" | "Human";
type Mammal = Exclude<Animal, "Human">;
```

- Exclude 구현하기

```typescript
// T에 각 키들을 순회하면서 U에 일치하면 제외, 불일치하면 그대로 남김
type Exclude<T, U> = T extends U ? never : T;
```

#### Extract (key들에 적용)

필요한 키들만 추출할 때, 사용한다.

- Extract 구현하기

```typescript
type Extract<T, U> = T extends U ? T : never;
```

### Required, Readonly, Record, NonNullable 타입 분석

#### Required (interface에 적용)

기존의 optional이었던 키들을 다 필수로 변경시키는 타입이다.
`-` modifier를 사용한다.

```typescript
type Required<T> = {
  [Key in keyof T]-?: T[Key];
};
```

#### Readonly (interface에 적용)

타입들의 키를 가져올때, 수정은 못하게 하는 타입이다.

```typescript
type Readonly<T> = {
  readonly [Key in keyof T]: T[Key];
};
```

반대로 남의 타입들의 키들이 readonly일 때, readonly 속성을 빼는 방법은 `-` modifier를 붙이는 것이다.

```typescript
type Readonly<T> = {
  -readonly [Key in keyof T]: T[Key];
};
```

#### Record

간단하게 객체형태 타입을 표현할 때 사용한다.

```typescript
type Record<T extends keyof any, S> = {
  [Key in T]: S;
};

const a: Record<string, number> = { a: 3, b: 5, c: 7 };
```

#### NonNullable (key에 적용)

Null 과 undefined를 빼고 프로퍼티들을 가져오고 싶을 때, 사용한다.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = string | null | undefined | boolean | number;
type B = NonNullable<A>; // string | boolean | number
```

### infer, Parameters,ConstructorParameters,InstanceType 타입 분석

#### Parameters

함수의 매개변수의 타입들을 가져오고 싶을 때, 사용한다. 튜플형태로 반환된다.

```typescript
function zip(
  x: number,
  y: string,
  z: boolean
): { x: number; y: string; z: boolean } {
  return { x, y, z };
}
type Params = Parameters<typeof zip>;

// type Params = [x: number, y: string, z: boolean]
type aa = Params[0]; // number
```

- Parameters 구현하기
  `T extends (...args:any) => any` : T는 함수라는 의미

```typescript
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never;
```

#### infer

extends에서만 사용가능한 타입스크립트가 알아서 추론하는 역할이다.
`추론 조건 ? 추론 성공 시의 값 : 추론 실패 시의 값`
`T extends (...args: infer A) => any? A: never` : 매개변수 자리를 알아서 추론하는 코드

- 리턴값의 타입을 반환할 경우, infer 위치를 다음과 같이 리턴 자리로 놓는다.

```typescript
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer A
  ? A
  : never;
```

#### ConstructorParameters

생성자 함수 타입의 파리미터(매개변수)들을 튜플 형태로 얻어내는 타입이다.
`abstract new` : 생성자 모양

```typescript
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

class A {
  a: string;
  b: number;
  c: boolean;

  constructor(a: string, b: number, c: boolean) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

const d = new A("123",123,true)
type C = ConstructorParameters<tyoeof A> // [a:string, b:number, c:boolean]
```

#### InstanceType

생성자 함수 타입의 인스턴스 타입을 얻어내는 타입이다.

```typescript
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;

class A {
a: string;
b: number;
c: boolean;

constructor(a: string, b: number, c: boolean) {
  this.a = a;
  this.b = b;
  this.c = c;
}
}

const d = new A("123",123,true)
type C = InstanceType<tyoeof A> // A
```

### 완전 복잡한 타입 분석하기(Promise와 Awaited 편)

```typescript
const p1 = Promise.resolve(1)
  .then((a) => a + 1)
  .then((a) => a + 1)
  .then((a) => a.toString());
const p2 = Promise.resolve(2); // Promise<number>
const p3 = new Promise((res, rej) => {
  // Promise<unknown>
  setTimeout(res, 1000);
});

type Result = Awaited<{ then(onfulfilled: (v: number) => number): any }>;
// type Result = number

Promise.all([p1, p2, p3]).then((result) => {
  // {"0":string,"1":number,"2":undefined,length:3}
  console.log(result); // {"3",2,undefined}
});

// T = [p1, p2, p3] => 왼쪽 형태는 오른쪽과 같다 {"0":p1,"1":p2,"2":p3, length:3 }
// keyof T = "0" | "1" | "2" | length

const lst = [1, 2, 3] as const;
type Lst = keyof typeof lst;
const key: Lst = "3"; // '"3"' 형식은 'keyof readonly [1, 2, 3]' 형식에 할당할 수 없습니다.ts(2322)
```

#### Promise

```typescript
    all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
```

#### Awaited

```typescript
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> =
    T extends null | undefined ? T : // special case for `null | undefined` when not in `--strictNullChecks` mode
        T extends object & { then(onfulfilled: infer F): any } ? // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
            F extends ((value: infer V, ...args: any) => any) ? // if the argument to `then` is callable, extracts the first argument
                Awaited<V> : // recursively unwrap the value
                never : // the argument to `then` was not callable
        T; // non-object or non-thenable
```

##### Duck Typing

동적으로 타이핑 하는 방식으로, 아래와 같이 어떤 타입 F에 걸맞는 변수를 지니면 해당 타입에 속하는 것으로 간주한다.
