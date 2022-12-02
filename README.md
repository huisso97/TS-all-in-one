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
