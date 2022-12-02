# Typscript Handbook

## 타입스크립트의 목표

- 자바스크립트 프로그램의 정적 타입 검사자
- 코드가 실행되기 전에 실행하고(정적), 프로그램 타입이 정확한지 확인하는 도구(타입 검사)

## 실습 목표

- [ ] 일반적으로 사용하는 타입스크립트 구문 및 패턴을 읽고 이해하기
- [ ] 중요한 컴파일러 옵션의 효과 설명하기
- [ ] 대부분의 경우에서 타입 시스템 동작을 올바르게 예측하기
- [ ] 간단한 함수, 객체 또는 클래스에 대한 .d.ts 선언 작성하기

### The Basics

#### 정적 타입 검사

- 자바사크립트 런타임은 코드가 실행될 때 자신이 무엇을 해야 할지 결정하기 위하여 값의 타입, 즉 해당 값이 어떤 동작과 능력을 가지고 있는지를 확인한다.
- 예를 들어, `string`과 `number`과 같은 원시 타입의 값의 경우, `typeof`연산자를 사용하면 각 값들의 타입을 실행 시점에 알 수 있다. 그러나 함수와 같은 그 밖의 값들의 경우, 해당 값의 타입을 실행 시점의 메커니즘은 존재하지 않는다.

```javascript
function fn(x) {
	return x.flip();
```

위 코드에서 자바스크립트는 `fn`를 호출하여 무슨 일이 벌어지는지 봄으로써, 인자로 전달된 `x` 객체가 `flip` 프로퍼티를 호출할 수 있는지 확인할 수 있다. 즉, 코드가 어떤 동작 결과를 보일지 코드를 작성하는 동안에는 어렵다.

- 이때, 타입이란 어떤 값이 `fn`으로 전달되어, 어떤 값이 실행에 성공 혹은 실패할 것임을 설명하는 개념이다.
- 자바스크립트는 오직 동적 타입만을 제공하며, 코드를 실행해야만 어떤 일이 벌어지는지 비로소 확인이 가능하다.
- 그러므로, 정적 타입 시스템을 활용하여 코드가 실행되기 전 코드에 대해 예측하는 것이다.

#### 예외가 아닌 실행 실패

- 자바스크립트 런타임은 예기치 못한 문제가 발생했을 때 에러를 직접 말해주기도 하지만, 우리의 의도와 다르게 반응하기도 한다.

```javascript
const user = {
  name: "Daniel",
  age: 26,
};
user.location; // undefined 를 반환
```

위와 같이 객체에 존재하지 않는 프로퍼티 접근 시, 오류가 아닌 undefined가 반환된다.

- 정적 타입 시스템은 이러한 "유효한" 자바스크립트 코드일지라도, 오류로 간주되는 경우라면 해당 프로퍼티가 정의되지 않았다는 오류를 알려준다.
- 이외에도 오타, 호출되지 않은 함수("()"가 붙어있지 않은 함수), 논리 오류 등으로 인한 버그를 잡아낸다.

#### tsc, TypeScript 컴파일러

1. 실습 폴더 생성
2. npx init -y 명령어로 package.json 생성
3. npm install typescript
4. npx tsc hello.ts

- 공식문서에서는 타입스크립트 컴파일러 tsc를 전역으로 설치하였기 때문에, tsc 명령어를 사용할 수 있지만, 나의 경우, 로컬 node_modules 패키지로 실행하기 때문에, npx 도구를 사용한다.

5. hello.js 파일 생성 확인

- tsc가 hello.ts 파일을 자바스크립트 파일로 컴파일 또는 변형한 결과물

#### 오류 발생시키기

`--noEmitOnerror`컴파일러 옵션을 사용하여, 타입 오류가 나는 코드가 있으면, 자바스크립트로 변환하지 않는다.

```bash
npx tsc --noEmitOnError hello.ts
```

#### 명시적 타입

아래와 같이 인자들에 대해 타입을 명시함으로써 해당 함수를 올바르게 사용할 수 있도록 해준다.

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
// Argument of type 'string' is not assignable to parameter of type 'Date'.
```

- 자바스크립트에서 Date()를 호출 시, typeof Date() === string 이지만, 타입스크립트에서는 new Date() 가 Date 타입을 반환하기 때문에, 위의 코드에서 인자가 Date 타입의 값을 받을 수 있도록
- Date() -> new Date()로 바꿔야한다.

#### 다운레벨링

타입스크립트는 새 버전의 ECMAScript 코드를 ECMAScript 5와 같은 예전 버전의 것들로 다시 작성한다. 이렇게 하위 버전으로 바꾸는 과정을 다운레벨링이라고 부른다.

- `--target` 플래그를 설정하여 보다 최근 버전을 타겟으로 변환을 수행할 수도 있다.

#### 엄격도

- `noImplicitAny` : `any`로 추론되는 변수에 대해 오류 발생
- `strictNullChecks` : `null`과 `undefined`가 다른 타입의 값에 할당될 수 없도록 함

### Everyday Types

JavaScript 코드에서 가장 흔한 타입들을 다루고, 이 타입들을 TypeScript에서 어떻게 기술하는지 각각의 대응하는 방식에 대하여 정리한다.

#### 원시 타입 : `string`, `number`, 그리고 `boolean`

- 이 타입들은 JavaScript에서 각 타입별 값에 `typeof` 연산자를 사용했을 때 얻을 수 있는 것과 동일한 이름을 가진다.
- `String`, `Number`, `Boolean`와 같은 대문자로 시작하는 타입은 유효한 타입이지만, 코드상에서 이러한 특수 내장 타입을 사용하는 경우는 드물다. 그러므로 항상 `string`, `number`,`boolean` 타입을 사용해야한다.

#### 배열

- [1,2,3]과 같은 배열 타입은 `number[]` 혹은 `Array<number>`와 같은 형태로 적을 수 있다.
- [number]은 튜플 타입이므로 전혀 다른 의미이기 때문에 주의한다.

#### `any`

- 특정 값으로 인하여 타입 검사 오류가 발생하는 것을 원하지 않을 때 사용한다.
- 타입이 `any`이면, 해당 값의 임의의 속성에 접근할 수 있고(이때 반환되는 값의 타입도 `any`이다.), 함수인 것처럼 호출, 다른 임의 타입의 값에 할당, 그 밖에도 구문적으로 유효한것이라면 무엇이든 할 수 있다.
- `any`타입은 코드상에 문제가 없다고 TypeScript를 안심시킨다는 목적 단지 하나 이기 때문에, 긴 타입을 새로 정의하고 싶지 않을 때 유용하다.

##### `noImplicitAny`

컴파일러 플래그 `noImplicitAny`를 사용하면 암묵적으로 `any`로 간주되는 모든 경우에 오류를 발생시킨다.

#### 변수에 대한 타입 표기

대부분의 경우, TypeScript는 자동으로 변수의 초깃값의 타입을 바탕으로 변수 타입을 추론하기 때문에 타입 표기가 필요하지 않지만, 명시적으로 지정하기 위하여 추가할 수 있다.

```typescript
let myName: string = "Alice";
```

#### 함수

##### 매개변수 타입 표기

함수를 선언할 때, 함수가 허용할 매개변수 타입을 선언하기 위하여 매개변수 뒤에 타입을 표기할 수 있다.
타입이 표기되었다면, 해당 함수에 대한 인자는 검사가 이루어진다.

```typescript
// 매개변수 타입 표기
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
greet(42);
// 숫자타입의 인자는 문자열 타입에 할당될 수 없다는 에러가 반환됨.
```

##### 반환 타입 표기

반환 타입은 매개변수 목록 뒤에 표기한다.

- 변수의 타입 표기와 마찬가지로, TypeScript가 해당 함수에 있는 `return`문을 바탕으로 반환 타입을 추론하기 때문에, 타입 표기는 선택사항이다.
- 문서화 혹은 코드의 잘못된 수정을 방지하고자 명시적으로 표기를 하기도 한다.

```typescript
function getFavoriteNumber(): number {
  return 26;
}
```

##### 익명 함수

함수가 어떻게 호출될지 알아내어, 해당 함수의 매개 변수에 자동으로 타입을 부여한다.

```typescript
// 아래 코드에는 타입 표기가 전혀 없지만, TypeScript는 버그를 감지할 수 있습니다.
const names = ["Alice", "Bob", "Eve"];

// 함수에 대한 문맥적 타입 부여
names.forEach(function (s) {
  console.log(s.toUppercase());
Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```

- 매개변수 `s`에는 타입이 표기되어 있지 않지만, 타입스크립트가 `s`의 타입을 알아내기 위해 배열의 추론된 타입 및 `forEach`함수의 타입을 활용하였다.
- 앞의 과정을 **문맥적 타입 부여** 라고 부른다.
- **문맥적 타입 부여**는 함수가 실행되는 문맥을 통하여 해당 함수가 가져야하는 타입을 알아내는 과정이다.

#### 객체 타입

객체는 프로퍼티를 가지는 JavaScript 값을 말하며, 해당 객체의 프로퍼티들과 각 프로퍼티의 타입들을 나열하여 객체 타입을 정의한다.

##### 옵셔널 프로퍼티

- 객체 타입은 이룹 또는 모든 프로퍼티의 타입을 선택적인 타입인 **옵셔널**로 지정할 수 있다. 프로퍼티 뒤에 `?`를 붙이면 된다.
  JavaScript에서는 존재하지 않는 프로퍼티 접근 시, 런타임 오류가 아닌 `undefined`를 반환한다. 이 때문에, 옵셔널 프로퍼티에 접근시 `undefined` 여부를 확인해야한다.

```typescript
function printName(obj: { first: string; last?: string }) {
  // 오류 - `obj.last`의 값이 제공되지 않는다면 프로그램이 멈추게 됩니다!
  console.log(obj.last.toUpperCase());
  // Object is possibly 'undefined'.
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // 최신 JavaScript 문법을 사용하였을 때 또 다른 안전한 코드
  console.log(obj.last?.toUpperCase());
}
```

#### 유니언 타입

유니언 타입은 서로 다른 두 개 이상의 타입들을 사용하여 만드는 것으로, 유니언 타입의 값은 타입 조합에 사용된 타입 중 무엇이든 하나를 타입으로 가질 수 있다. 조합에 사용된 각 타입을 유니언 타입의 멤버라고 부른다.

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// 오류
printId({ myID: 22342 });
Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
```

##### 유니언 타입 사용하기

타입스크립트에서는 유니언을 다룰 때, 해당 유니언 타입의 `모든 멤버`에 대하여 유효한 작업일 때에만 허용이 된다. 예를 들어, `string|number` 유니언 타입의 경우, `string`타입에만 유효한 메서드인 `toUpperCase()`를 사용할 수 없다.
이를 해결하기 위해서는 코드상에서 `typeof`연산을 통해 유니언을 좁혀서 각 타입에 유효한 메서드를 쓴다.

```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // 여기에서 'x'는 'string[]' 타입입니다
    console.log("Hello, " + x.join(" and "));
  } else {
    // 여기에서 'x'는 'string' 타입입니다
    console.log("Welcome lone traveler " + x);
  }
}
```

#### 타입 별칭

타입 별칭은 타입을 위한 이름을 제공하여 재사용 가능하게 해준다. 객체 타입 뿐만 아니라 모든 타입에 대하여 부여할 수 있다.

```typescript
type ID = number | string;
```

#### 인터페이스

인터페이스는 오직 객체의 모양을 선언하는 데에만 사용되며, 기존의 원시 타입에 별칭을 부여하는 데에는 사용할 수 없다.

- 타입스크립트는 오직 전달된 값의 구조, 즉 예측된 프로퍼티를 가졌는지 여부만 따지기 때문에, 타입스크립트가 구조적 타입 시스템 이라고 불리는 이유이다.

#### 타입 별칭과 인터페이스의 차이점

둘은 매우 유사하며, 둘 중 하나를 자유롭게 선택해서 사용한다.
둘의 가장 핵심적인 차이는, 타입은 새 프로퍼티를 추가하도록 개방될 수 없지만, 인터페이스의 경우 확장될 수 있다는 점이다.

- 인터페이스는 선언 병합에 포함될 수 있지만, 타입 별칭은 포함될 수 없다.

```typescript
// 기존의 인터페이스에서 새 필드 추가하기
interface Mammal {
    genus: string
}

interface Mammal {
    breed?: string
}

const animal: Mammal = {
    genus: "1234"
    breed: "1"
}

// 타입은 생성된 뒤에는 달라질 수 없다.
type Reptile = {
    genus: string
}
// 아래 코드는 에러 반환
type Reptile = {
    breed?: string
}
```

```typescript
// 인터페이스 확장하기
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;

// 교집합을 통하여 타입 확장하기
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: Boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```

#### 타입 단언

타입스크립트보다 우리가 어떤 값의 타입에 대해 정보르 더 잘 아는 경우도 있다.
예를 들어, 아래의 코드처럼 `getElementById`의 반환값으로 타입스크립틑 `HTMLElement` 중 무언가로 반환된다는 것은 알지만, 우리는 페이지상 사용되는 아이디를 통해 `HTMLCanvasElement` 라는 것을 안다.
그러면, 타입 단언을 통해 아래처럼 타입을 부여해준다.

- `as` 혹은 꺾쇠괄호를 사용하여 타입 단언을 사용한다.

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

- 타입 단언은 컴파일 시간에 제거되므로, 타입 단언에 과련된 검사는 런타임 중에 일어나지 않는다. 그러므로, 타입 단언이 틀려도 예외가 발생하거나 null이 생성되지 않는다.

타입스크립트에서는 보다 구체적인 혹은 덜 구체적인 타입으로 변환하는 타입 단언만이 허용된다. 그래서 아래와 같은 "불가능한"강제 변환을 방지한다.

```typescript
const x = "hello" as number;
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```

이 규칙이 때로는 지나치게 보수적으로 작용하여, 유효할 수 있는 강제 변환이 허용되지 않기도 한다. 이런 경우, 아래와 같이 `any`로 우선 변환 후(혹은 `unknown`), 원하는 타입으로 변환하면 된다.

```typescript
const a = expr as any as T;
```

#### 리터럴 타입

`string`과 같은 일반적인 타입 이외에도, 구체적인 문자열과 숫자 값을 타입 위치에서 지정할 수 있다.
즉, 자바스크립트에서 `let`,`var`의 모든 변수에 저장 가능한 값의 종류를 변경할 수 있다는 것을 감안하여, 타입스크립트가 리터럴 값을 위한 타입을 생성하는 방식을 적용할 수 있는 것이다.

```typescript
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.
```

리터럴을 유니언과 함께 사용한다면, 특정 종류의 값들만을 인자로 받을 수 있는 함수를 정의하는 경우 등에 쓰일 수 있다.

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");

printText("G'day, mate", "centre");
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

숫자 리터럴 타입 또한 같은 방식으로 사용할 수 있다.

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

뿐만 아니라, 타입과도 함게 사용 가능하다.

```typescript
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

#### 리터럴 추론

객체 타입의 변수를 초기화할 때, 타입스크립트는 해당 객체의 프로퍼티 타입을 리터럴 타입으로 정의하는 것이 아닌, 해당 프로퍼티 `typeof` 결과값을 타입으로 정의한다.
이는, 타입은 읽기 및 쓰기 두 동작을 결정하는 사용되기 때문이다.

```typescript
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

위의 코드에서 `req.method`는 `string`으로 추론이 되지, `GET`으로 추론되지 않는다.
이는 타입스크립트 입장에서 `req`의 생성 시점과 `handleRequest`의 호출 시점 사이에도 얼마든지 객체의 프로퍼티에 다른 값(`GET` -> `PUT`)이 대입될 수 있다고 판단하기 때문에, 오류를 발생시키는 것이다.

이러한 경우 다음 두 가지 방법으로 해결할 수 있다.

1. 둘 중에 한 위치에 타입 단언을 추가하여 추론 방식을 변경한다.

```typescript
// 수정 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// 수정 2
handleRequest(req.url, req.method as "GET");
```

- 수정 1의 경우, `method`가 항상 리터럴 타입 "GET"이기를 의도하여, "PUT" 과 같은 닫른 값이 대입되는 경우를 미연에 방지하는 것을 의미한다.
- 수정 2의 경우, 무슨 이유로 `req.method`가 "GET"을 값으로 가진다는 사실을 알고 있다는 것을 의미한다.

1. `as const`를 사용하여 객체 전체를 리터럴 타입으로 변환한다.
   - `as const`의 접미사는 해당 객체의 프로퍼티가 `string`, `number`와 같은 일반적인 타입이 아닌, 리터럴 타입의 값이 대입되도록 보장한다.

```typescript
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

#### `null`과 `undefined`

자바스크립트에서는 빈 값 또는 초기화되지 않은 값을 가리키는 두 가지 원시값, `null`과 `undefined`가 있다.
타입스크립트에서는 각 값에 대응하는 동일한 두 가지 타입이 있으며, `strictNullChecks`옵션 설정 여부에 따라 달라진다.

- `strictNullChecks`가 설정되지 않았을 때
  어떤 값이 `null` 또는 `undefined` 일 수 있더라도 해당 값에 평소와 같이 접근할 수 있으며, 모든 타입의 변수에 대입될 수 있다.
- `strictNullChecks`가 설정되었을 때
  어떤 값이 `null` 또는 `undefined`일 때, 해당 값과 함께 메서드 또는 프로퍼티를 사용하기에 앞서 해당 값이 `null` 또는 `undefined`인지 여부를 검사(타입 좁히기)한 후, 연산을 수행해야한다.

#### Null 아님 단언 연산자(접미사 `!`)

타입스크립트에서는 명시적인 검사를 하지 않고도 표현식 뒤에 `!`를 작성함으로써, 해당 값이 `null` 또는 `undefined`가 아니라고 타입 단언을 할 수 있다.

- 이 구문 또한 코드의 런타임 동작을 변화시키지 않으므로, 해당 값이 `null` 또는 `undefined`가 아닌 경우에만 사용해야 한다.

```typescript
function liveDangerously(x?: number | undefined) {
  // 오류 없음
  console.log(x!.toFixed());
}
```

#### 열거형

이름이 있는 상수들의 집합을 정의한다. 열거형을 사용하면 의도를 문서화하거나 구분되는 사례 집합을 더 쉽게 만들 수 있다.
타입스크립트는 숫자와 문자형 기반 열거형을 제공한다.

#### 자주 사용되지 않는 원시형 타입

##### `bigint`

`bigint`는 ES2020 이후 아주 큰 정수를 다루기 위한 원시타입으로 추가되었다.

```typescript
// BigInt 함수를 통하여 bigint 값을 생성
const oneHundred: bigint = BigInt(100);

// 리터럴 구문을 통하여 bigint 값을 생성
const anotherHundred: bigint = 100n;
```

##### `symbol`

`symbol`은 전역적으로 고유한 참조값을 생성하는 데에 사용할 수 있는 원시 타입이다.

```typescript
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
This condition will always return 'false' since the types 'typeof firstName' and 'typeof secondName' have no overlap.
  // 절대로 일어날 수 없습니다
}
```

##### 자료 출처

[타입스크립트 HandBook](https://www.typescriptlang.org/ko/docs/handbook)
