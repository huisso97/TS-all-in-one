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
