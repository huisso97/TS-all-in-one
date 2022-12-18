## 기본 세팅하기

### 타입스크립트를 사용하는 이유

자바스크립트를 타입스크립트로 바꾸면 안전성이 높아짐, 그러나 자유도는 줄어듦
그러나, 에러가 안나는 것이 중요!

### tsc의 역할

1. 타입스크립트 코드를 자바스크립트로 변환해주는 역할을 한다.
2. 코드 자체에 타입 검사를 해준다.

### tsconfig.json 생성

```bash
npx tsc --init
```

- `allwoJs:true` : 만약 자바스크립트와 타입스크립트를 동시에 쓰고 싶다면 설정 추가
- `target`: 변환하고자 하는 타입스크립트 버전을 설정하는 속성
- `forceConsistentCasingInFileNames` :window는 대소문자 안지키지만 ,linux와 mac은 대소문자를 지킨다. 그래서, 대소문자 지켜서 import 할 수 있게 하는 속성
- `skipLibCheck` : 라이브러리 타입 파일(.d.ts)들 검사 넘기는 속성

**타입검사 기능과 코드 변환 기능은 각각 별개이다**
`npx tsc` : TS -> JS 변환 명령어
`npx tsc --noEmit`: 코드 타입 검사 명령어

## 기본 문법 배우기

### 타입스크립트는 자바스크립트에서 변수, 매개변수, 리턴값에 타입을 붙이는 것!

#### any

- any를 쓰면 타입스크립트가 아닌 자바스크립트를 쓰는 것과 같다.

#### 매개변수, 리턴값 타입 자리

##### function

```typescript
function add(x: number, y: 매개변수타입): 리턴값 타입 {
  return x + y;
}
```

##### arrow function

```typescript
const add:(x:number, y:매개변수타입) => 리턴값 타입 = (x,y) => {return x+y};

// 자바스크립트 변환시
const add= (x,y) => {return x+y};
```

##### type 분리하기

###### type

```typescript
type Add = (x: number, y: number) => number;
const add: Add = (x, y) => {
  return x + y;
};
```

###### interface

```typescript
interface Add {
  (x: number, y: number): number;
}
const add: Add = (x, y) => {
  return x + y;
};
```

#### 배열 및 튜플 타입

- 배열은 값을 추가할 수 있지만, 튜플은 값이 고정되어있고 추가는 불가핟.

```typescript
// 배열 타이핑
const arr: string[] = ["123", "456", "345"];
// 튜플 타이핑
const arr: [number, number, string] = [123, 456, "345"];
```

### 타입 추론을 적극 활용하자

티입스크립트는 기본적으로 타입 추론을 한다. 만약, 특정 값의 타입이 any 혹은 타입이 이상하다면, 직접 타이핑을 한다.

### 타입 방법

#### ":" 콜론

```typescript
const f: true = true;
```

#### type

```typescript
type Add = () => number;
```

#### interface

```typescript
interface Minus {}
```

#### function 타입

```typescript
// add라는 함수 타입을 선언한 것
function add(x: number, y: number): number;

function add(x, y) {
  return x + y;
}
```

#### as

```typescript
let aa = 123;
aa = "hello" as unknown as number;
```

### never타입과 느낌표(non-null assertion)

#### 빈배열로 초기화할 시 never가 담기기 때문에, 꼭 타입 선언을 한다.

```typescript
const array = []; //type : never[]
array.push("hello"); // string 형식의 인수는 never형식에 할당할 수 없다.

const array: string[] = []; //type: string[]
```

#### 느낌표는 값이 Null이나 undefined가 아님을 보증한다.

- 느낌표는 null이나 undefined가 아님을 보증하지만, 값이 바뀌면 그에 따라 에러가 발생할 수 있으므로, 2안처럼 쓰는 것을 권장한다.

```typescript
const head = document.querySelector("#head"); //type : Element | null

// 1안
const head = document.querySelector("#head")!; //type : Element

// 2안
if (head) {
  head.innerHTML = "hello";
}
```

### 원시 래퍼 타입, 템플릿 리터럴 타입, rest, 튜플

#### 원시 래퍼 타입

`String`은 래퍼 개체이므로, 타입을 지정할때는 소문자 `string`을 사용해햐아한다.

#### 템플릿 리터럴 타입

템플릿 리터럴 형태로 타입 단언을 할 수 있다.
타입을 정교하게 선언할 때 사용되는 방식으로, 먼저 템플릿 리터럴 내 쓰일 타입을 단언한 후, 최종 템플릿 리터럴 타입을 단언하면 해당 타입(아래의 Greeting)을 할당받은 변수(아래의 c)는, 자동 추천 기능을 통해 타입 내 값들을 추천받을 수 있다.

```typescript
type World = "world" | "hell";

// type Greeting = "hello world"
type Greeting = `hello ${World}`;

const c: Greeting = "hello world";
// 또는  hello hell 을 추천받을 수 있음
```

#### rest

rest 파라미터의 타입들도 아래와 같이 지정할 수 있다.

```typescript
function rest(...args: string[]) {
  console.log(args); // [1,2,3]
}

rest("1", "2", "3");
```

#### 튜플

튜플 타입의 경우, 대괄호 안에 지정된 각 매개변수의 타입들을 넣어준다.
그러나 아래의 코드처럼, push 메서드로 매개변수를 추가할 경우, 타입스크립트가 에러로 감지를 못하기 때문에 유의해야한다.

```typescript
const tuple: [string, number] = ["1", 1];
tuple[2] = "hello"; // error 발생
tuple.push("hello"); // 정상 작동
```

### enum, keyof, typeof

#### enum

변수들을 하나의 그룹으로 묶고 싶을 때, enum을 쓴다.
string 혹은 number를 지정할 수 있으며, 따로 지정을 하지 않으면 0부터 순서대로 지정된다(Direction 참고).

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const aa = Direction.Up; // const aa = 0

const enum EDirection {
  Up = 3,
  Down = 5,
  Left = 4,
  Right = 6,
}
const a = EDirection.Up; // const a = 3
const b = EDirection.Down; // const b= 5

const enum SDirection {
  Up = "123",
  Down = "hello",
  Left = "wow",
  Right = "enum",
}

const aaa = SDirection.Left; // const aaa = "wow"
```

하나의 객체로 만드는 방식과 enum의 결과값은 똑같다.

- 객체로 만드는 방식 : 해당 값들을 상수로 쓰겠다고 선언하는 것과 동일
  - `as const` 접미사를 붙여서 사용함으로써, 고정적으로 타입을 지정한다.
- 차이점 : 자바스크립트로 변환 시, 객체로 만든 방식은 코드가 남아있지만, enum은 사라진다(타입스크립트 문법이기 때문)

```typescript
// 객체로 타입을 만든 방식
const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

// 위의 코드는 아래처럼 상수로 선언한 것과 동일하다.
const ODirection: { Up: 0; Down: 1; Left: 2; Right: 3 } = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
};

// 타입 지정을 안했을 때, 타입스크립트는 내부 값들의 0,1,2,3 을 전부 number로만 인식한다.
const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
};

// enum 타입 방식
const enum EDirection {
  Up = 3,
  Down = 5,
  Left = 4,
  Right = 6,
}
```

#### keyof, typeof

```typescript
const obj = { a: "hi", b: "hello", c: "world" } as const;

/*
const obj: {
  readonly a: "hi";
  readonly b: "hello";
  readonly c: "world";
};
**/

// obj 타입의 key들만 들고올 때
type Key = keyof typeof obj; // type Key = "a" | "b" | "c"

// obj 타입의 value들만 들고올 때

type Value = typeof obj[Key]; // type Value = "hi" | "hello" | "world"
```

### union(|)과 intersection(&)

#### union타입은 여러 속성 중 하나만 있어도 된다.

#### intersection타입은 모든 속성이 다 있어야 한다.

```typescript
// union
type A = { hello: "world" } | { zero: "cho" };
const a: A = { hello: "world" }; // no error

// intersction
type B = { hello: "world" } & { zero: "cho" };
const b: B = { hello: "world" };
//   'zero' 속성이 '{ hello: "world"; }' 형식에 없지만 '{ zero: "cho"; }' 형식에서 필수입니다.ts(2322)

const c: B = { hello: "world", zero: "cho" }; // no error
```

### 잉여 속성 검사

타입스크립트는 객체 리터럴을 바로 변수에 대입했을 때, 해당 타입에 없는 속성이 있을 경우(잉여 속성 검사) 에러를 반환한다.
그러나, 중간에 해당 객체 리터럴을 대입한 다른 변수를 값으로 넣으면, 에러를 반환하지 않기 때문에 이 부분은 유의해야 한다.

```typescript
interface A {
  a: string;
}
// 잉여 속성 검사 on
const obj1: A = { a: "hello", b: "world" }; // error

const obj = { a: "hello", b: "world" };
const obj2: A = obj; // no error
```

### void의 두 가지 방법

매개변수에 할당된 void type은 실제 return 값이 있어도 상관쓰지 않겠다라는 의미이고,
함수의 리턴값에 할당된 void type은 함수의 return 값이 없거나 undefined라는 것을 의미한다.

```typescript
interface A {
  talk: () => void;
}

const a: A = {
  talk() {
    return 3;
  }, // no error
};

function B(): void {
  return "hello"; // error : return값이 없거나 undefined여야함
}
```

### unknown 과 any (그리고 타입 대입가능표)

unknown은 지금 당장 타입을 모를 경우 사용하여 추후 as 연산자로 타입을 정의해줄 수 있지만, any는 타입 검사를 포기하기 때문에, unknown을 쓰는 것을 권장한다.

### 타입 가드 (타입 좁히기)

유니온 타입과 같이, 다양한 타입 가능성이 있을 경우, 타입 가드를 통해 타입을 좁혀서 관련 메서드를 사용한다.

```typescript
function numRoStr(a: number | number[] | string) {
  if (typeof a === "number") {
    a.toFixed(1);
  } else if (Array.isArray(a)) {
    a.slice(1);
  } else if (typeof a === "string") {
    a.charAt(3);
  }
}
```

#### 객체 타입 체크

```typescript
type B = { type: "b"; bbbb: string };
type B = { type: "c"; cccc: string };
type B = { type: "d"; dddd: string };
function typeCheck(a: B | C | D) {
  if ("bbbb" in a) {
    a.type;
  } else if ("ccc" in a) {
    a.ccc;
  } else {
    a.ddd;
  }
}
```

#### 커스텀 타입 가드(is, 형식 조건자)

타입을 구분해주는 커스텀 함수를 직접 만들 수 있다.
if 문안에 쓰여 타입스크립트한테 정확한 타입을 알려줄 떄, 커스텀 타입 가드를 쓴다.

```typescript
interface Cat {
  meow: number;
}
interface Dog {
  bow: number;
}

function catOrDog(a: Cat | Dog): a is Dog {
  // 타입 판별을 직접 만든다.
  if ((a as Cat).meow) {
    return false;
  }
  return true;
}

function pet(a: Cat | Dog) {
    // true면, Dog
    console.log(a.bow);
  }
  if ("meow" in a) {
    console.log(a.meow);
  }
}
```

### {} 와 Object

`{}`와 `Object`는 모든 타입을 나타낸다.
`object`는 객체 타입을 나타낸다. 그러나, 객체 타이핑의 경우 object를 지양하고, interface, type, class로 정의하는 것을 권장한다.
`unknown = {} | null | undefined` => null과 undefined를 포함한 모든 타입

```typescript
const x: {} = "hello";
const y: Object = "hi"; // {}와 Object는 모든 타입 (null 과 undefined 제외)
const xx: object = "hi";
const yy: object = { hello: "world" };
const z: unknown = "hi";

if (z) {
  z; // {}
} else {
  z; // null | undefined
}
```

### readonly, 인덱스드 시그니처, 맵드 타입스

#### readonly

속성 값 변경을 막고자할 때, 사용한다.

```typescript
interface A {
  readonly a: string;
  b: string;
}
const aaaa: A = { a: "hello", b: "world" };
aaaa.a = "123"; // error
```

#### 인덱스드 시그니처

아래처럼, 키 타입을 정의하여 간단하게 표현할 수 있는 방법이다.

```typescript
// type A = { a: string; b: string; c: string };
// 위와 동일한 의미를 가진다.
type A = { [key: string]: string };

const aaaa: A = { a: 3, b: 5, c: 6 };
```

#### 맵드 타입스

key에 대한 타입을 제한할 때, 사용한다.

- 참고로 interface 내에서는 `|` 과 `&` 이 안되기 때문에, type 단언을 사용하여 아래와 같이 표현한다(type B).

```typescript
type B = "Human" | "Mammal";
type A = { [key in B]: B };
const bbbb: A = { Human: "Mammal", Mammal: Human };
```

### 클래스의 새로운 기능들

```typescript
// class
class A {
  a: string;
  b: number;
  constructor() {
    this.a = "123";
    this.b = 123;
  }

  method();
}
// constructor을 안쓸경우, 타입 정의할때, 초기화도 같이 해줘야함
class AA {
  a: string = "123";
  b: number = 123;

  method();
}
```

#### 클래스 인스턴스 및 클래스 타입

클래스 이름은 인스턴스를 가리키고, 클래스 타입은 typeof 로 나타낸 결과값이다.

```typescript
const a: A = new A("123"); // a는 A의 인스턴스
const B: typeof A = A; // B는 클래스 A의 타입을 가진 변수
```

#### private property

프라이빗으로 선언한 속성에는 접근할 수 없다.

```typescript
class A {
  #a: string;
  b: number;
  constructor() {
    this.a = "123"; // a 속성을 찾을 수 없음
    this.b = 123;
  }

  method();
}
```

#### 클래스의 모양을 인터페이스로 통제하는 방법

- implements, private, protected, public을 활용

```typescript
// 타입 추상화
interface W {
  readonly aa: string;
  b: string;
}

// class B는 타입 W을 구현한다.
class B implements W {
  private aa: string = "123"; // private이므로 class B 내에서만 쓸 수 있음
  protected b: string = "world";

  method() {
    console.log(this.aa); // private이니까 class B 내 메서드에서 사용 가능
  }
}

class C extends B {
  method() {
    console.log(this.aa); // private은 상속 관계에서는 접근 불가
    console.log(this.b); // protected는 상속받는 클래스까지는 접근 가능
  }
}
new C().aa; // aa는 private이므로 접근 불가
new C().b; // b는 protected이므로 접근 불가
```

```typescript
//            public    protected     private
클래스 내부      O           O            O
인스턴스         O           X            X
상속클래스       O           O            X
```

### 제너릭 기본

타입을 변수처럼 만들어서 같은 타입을 하나의 문자로 표현한다.

#### 제너릭 타입 제한하기

- 예를 들어, 제너릭 타입들을 각각 `string`과 `number`로 제한할 때, `extends`로 제한한다.

```typescript
function add<T extends number, K extends string>(x: T, y: K): T {
  return x + y;
}
add(1, "2");
```

```typescript
function hello<T extends { a: string }>(x: T): T {
  return x;
}
hello({ a: "hello" });
```

##### 콜백함수의 형태 제한

```typescript
// 콜백함수의 형태 제한
function callbackFunc<T extends (a: string) => number>(x: T): T {
  return x;
}
callbackFunc((a) => +a);
```

```typescript
// 콜백함수에 제한이 없는 경우
function noCallbackFunc<T extends (...args: any) => any>(x: T): T {
  return x;
}
callbackFunc((a) => +a);
```

##### 생성자로 타입 제한

```typescript
// 생성자만 넣고 싶을 때
function classFunc<T extends abstract new (...args: any) => any>(x: T): T {
  return x;
}
// class는 class 자체가 타입이다
class Q {}
classFunc(Q);
```

### 매개변수 기본값 타이핑

`:` 기준으로 우항에 타입핑을 한 후, `=` 기준으로 우항에 기본값 지정한다.

```typescript
const a = (b = { children: "zerocho" }) => {};

// : 기준으로 우항에 타입핑을 한 후, = 기준으로 우항에 기본값 지정
const a = (b : { children:string} = { children"zerocho" }) => {};

```

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

### 완전 복잡한 타입 분석하기(bind 편)

```typescript

```

### 완전 복잡한 타입 분석하기(flat 편)

```typescript

```
