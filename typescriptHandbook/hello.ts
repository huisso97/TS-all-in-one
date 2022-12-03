type A = { hello: "world" } | { zero: "cho" };

const a: A = { hello: "world" };

type B = { hello: "world" } & { zero: "cho" };

// const b: B = { hello: "world" };
//   'zero' 속성이 '{ hello: "world"; }' 형식에 없지만 '{ zero: "cho"; }' 형식에서 필수입니다.ts(2322)

const c: B = { hello: "world", zero: "cho" };
