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
그러나 아래의 코드처럼, push 메서드로 인자를 추가할 경우, 타입스크립트가 에러로 감지를 못하기 때문에 유의해야한다.

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
