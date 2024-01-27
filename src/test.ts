import { EventTransition, Event } from "./event";
import { State, StateTransition } from "./state";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type ImmutablePrimitive = undefined | null | boolean | string | number | Function;

export type RemoveReadonly<T> = T extends ImmutablePrimitive ?
  T : { -readonly [K in keyof T]: RemoveReadonly<T[K]> };

type EnforceGenericsInArrayElement<T> = T extends [infer First, ...infer Rest]
  ? Rest extends []
  ? [EnforceType<First>] // or [EnforceType<First>] to enforce a specific transformation
  : [EnforceType<First>, ...EnforceGenericsInArrayElement<Rest>]
  : never;

type EnforceType<T> = T extends EventTransition<infer A, infer B, infer C, infer D> ? EventTransition<A, B, C, D> : never;

const enforceType = <T extends Array<Array<any>>, Payload, Return>(array: T, p?: Payload, r?: Return): EnforceGenericsInArrayElement<RemoveReadonly<T>> =>
  array as EnforceGenericsInArrayElement<RemoveReadonly<T>>;

const enforce = <T>(array: T): EnforceType<T> => array as EnforceType<T>;

const fs = <A, B, C, D>(t: StateTransition<A, B, C, D>[]) => t
const fe = <A, B, C, D>(t: EventTransition<never, never, C, D>[]) => t

const state1: State<{ a: number }> = null as any;
const state2: State<{ a: number }> = null as any;
const state3: State<{ b: number }> = null as any;

const event: Event<{ c: number }> = null as any;


const StateAtoStateB: EventTransition<
  ExctractConttext<typeof state1>,
  ExtractContext<typeof state2>,
  Payload,
  Return> =
  [state1, state2];
