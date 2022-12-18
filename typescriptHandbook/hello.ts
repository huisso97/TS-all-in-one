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
  if (catOrDog(a)) {
    // true면, Dog
    console.log(a.bow);
  }
  if ("meow" in a) {
    console.log(a.meow);
  }
}
Promise;
// {} 와 object
const x: {} = "hello";
const y: Object = "hi"; // {}와 Object는 모든 타입
const xx: object = "hi";
const yy: object = { hello: "world" };
const z: unknown = "hi";

if (z) {
  z;
}

// class
class A {
  #a: string;
  #b: number;
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
interface W {
  readonly aa: string;
  b: string;
}

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
new C().aa; // 인스턴스로 만들어낸 클래스의 aa는 private이므로 접근 불가
new C().b; // 인스턴스로 만들어낸 클래스의 b는 protected이므로 접근 불가

// generic
function add<T extends number, K extends string>(x: T, y: K): T {
  return x + y;
}
add(1, "2");

function hello<T extends { a: string }>(x: T): T {
  return x;
}
hello({ a: "hello" });

// 콜백함수의 형태 제한
function callbackFunc<T extends (a: string) => number>(x: T): T {
  return x;
}
callbackFunc((a) => +a);

// 콜백함수에 제한이 없는 경우
function noCallbackFunc<T extends (...args: any) => any>(x: T): T {
  return x;
}
callbackFunc((a) => +a);

// 생성자만 넣고 싶을 때
function classFunc<T extends abstract new (...args: any) => any>(x: T): T {
  return x;
}
// class는 class 자체가 타입이다
class Q {}
classFunc(Q);
const predicate = (value: string | number): value is string =>
  typeof value === "string";
const filtered = ["1", 2, "3", 4, "5"].filter(predicate); // ['1','3','5'] string[]

const notPredicatedFiltered = ["1", 2, "3", 4, "5"].filter(
  (value) => typeof value === "string"
);

interface Arr<T> {
  forEach(callbackFunc: (value: T) => void): void;
  map<S>(callbackFunc: (value: T) => S): S[];
  filter<S extends T>(callbackFunc: (value: T) => value is S): S[];
}
const arr: Arr<number> = [1, 2, 3];
arr.forEach((val) => val.toString());
arr.map((val) => +val);
const b = arr.filter((v): v is number => v % 2 === 0);

function a(x: string | number): number {
  return 0;
}

type BB = (x: string) => number | string;
let bb: BB = a;

// 오버로딩
interface Addition {
  (x: number, y: number): number;
  (x: string, y: string): string;
}

const addition: Addition = (x: any, y: any) => x + y;
addition(1, 2);

// 에러 처리법
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
    if (err instanceof CustomError) {
      const customError = err;
      customError.response?.data;
    }
  }
})();

interface Profile {
  name: string;
  age: number;
  married: boolean;
}

type Name = Profile["name"];

type P<T> = {
  [Key in keyof T]?: T[Key];
};

const newI: P<Profile> = {
  name: "hui",
  age: 26,
};

type Pi<T, S extends keyof T> = {
  [Key in S]: T[Key];
};

type Animal = "Cat" | "Dog" | "Human";
type Mammal = Exclude<Animal, "Human">;

function zip(
  x: number,
  y: string,
  z: boolean
): { x: number; y: string; z: boolean } {
  return { x, y, z };
}
type Params = Parameters<typeof zip>;
type aa = Params[0];
// type Params = [x: number, y: string, z: boolean]

type PP<T extends (...args: any) => any> = T extends (...args: infer A) => any
  ? A
  : never;

type R<T extends (...args: any) => any> = T extends (...args: any) => infer A
  ? A
  : never;

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

// T = [p1, p2, p3] => 왼쪽 형태는 오른쪽과 같다 {"0":p1, "1":p2,"2":p3,length:3 }
