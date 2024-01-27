//
export type IsNever<T> = [T] extends [never] ? true : false;

export type IsAny<T> = (any extends T ? true : false) extends true
  ? true
  : false;

export type isVoid<T> = T extends void ? true : false;

export type IsSubtypeOf<T, U> = U extends T ? true : false;

export type Or<T> = T extends [infer U, ...infer V]
  ? U extends true
  ? true
  : Or<V>
  : false;

export type And<T> = T extends [infer U, ...infer V]
  ? U extends false
  ? false
  : And<V>
  : true;

type EnforceGenericsInArrayElement<T> = T extends [infer First, ...infer Rest]
  ? Rest extends []
  ? [EnforceType<First>] // or [EnforceType<First>] to enforce a specific transformation
  : [EnforceType<First>, ...EnforceGenericsInArrayElement<Rest>]
  : never;

/** */

type EnforceType<T> = T extends Double<infer U> ? Double<U> : never;

type Double<T> = { foo: T; bar: T };

const enforceType = <T extends Array<any>>(array: T): EnforceGenericsInArrayElement<T> =>
  array as EnforceGenericsInArrayElement<T>;

// Usage example
const enforcedArray = enforceType([
  { foo: "foo", bar: "bar" },
  { foo: 1, bar: 1 },
] as const);

type EnforceGenericsInArrayElement1<T, E> = T extends [infer First, ...infer Rest]
  ? Rest extends []
  ? [First extends E ? First : never] // or [EnforceType<First>] to enforce a specific transformation
  : [First extends E ? First : never, ...EnforceGenericsInArrayElement1<Rest, E>]
  : never;

type EnforceType1<T> = T extends Double<infer U> ? Double<U> : never;

type Double1<T> = { foo: T; bar: T };

const enforceType1 = <T extends Array<any>>(array: T): EnforceGenericsInArrayElement1<T, Double<any>> =>
  array as EnforceGenericsInArrayElement1<T, string>;

// Usage example
const enforcedArray1 = enforceType1([
  { foo: "foo", bar: "bar" },
  { foo: 1, bar: 1 },
] as const);

type EnforceConst<T> = T extends { [K in keyof T]: T[K] }
  ? { readonly [K in keyof T]: EnforceConst<T[K]> }
  : never;

function enforceConst<T>(array: T): EnforceConst<T> {
  return array as any as EnforceConst<T>;
}

const a = enforceConst([
  { foo: "foo", bar: "bar" },
  { foo: 1, bar: 1 },
]);
