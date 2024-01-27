import { type Event } from "./event";
import { type TransitionTargets, type TransitionAction } from "./transition";

/**
 * State associated with a state machine.
 */
export type State<Context = never, BaseToContext = unknown, BasePayload = unknown, BaseReturn = unknown> = {
  /**
   * The name of the state.
   */
  name?: string;
  /**
   * The description of the state.
   */
  description?: string;
  /**
   * Exit action to be executed when the state is exited.
   */
  exit?: TransitionAction<Context, BasePayload>;
  /**
   * Enter action to be executed when the state is entered.
   */
  enter?: TransitionAction<Context, BasePayload>;
  /**
   * Invariant function that describe when the context is valid for the state.
   */
  invariant?: StateInvariant<Context>;
  /**
   * The transitions defined inside the state.
   */
  transitions?: StateTransitions<Context, BaseToContext, BasePayload, BaseReturn>;
};

/**
 * State transition, represented as a tuple of the event and the transition targets.
 * 
 * @typeParam FromContext   - The type of the context before the transition.
 * @typeParam BaseToContext - The base context type shared by the various states
 *                            targeted by the event transitions, defaults to unknown.
 * @typeParam Payload       - The type of the payload for the transition.
 * @typeParam Return        - The type of the return value for the transition.
 */
export type StateTransition<FromContext = never, BaseToContext = unknown, Payload = never, Return = never> = [
  /**
   * The event associated with the transition.
   */
  event: Event<Payload, Return>,
  /**
   * The transition targets.
   */
  to: TransitionTargets<FromContext, BaseToContext, Payload, Return>,
];

/**
 * State transitions, represented as a map of transitions from an event to a
 * transition target.
 * 
 * @typeParam BaseFromContext - The base context type shared by the various states
 *                              from which the event transitions are possible,
 *                              defaults to unknown.
 * @typeParam BaseToContext   - The base context type shared by the various states
 *                              targeted by the event transitions, defaults to unknown.
 * @typeParam BasePayload     - The base payload type shared by the various events,
 *                              defaults to unknown.
 * @typeParam BaseReturn      - The base return type shared by the various events,
 *                              defaults to unknown.
 */
export type StateTransitions<BaseFromContext = unknown, BaseToContext = unknown, BasePayload = unknown, BaseReturn = unknown> = ReadonlyMap<
  StateTransition<BaseFromContext, BaseToContext, BasePayload, BaseReturn>[0],
  StateTransition<BaseFromContext, BaseToContext, BasePayload, BaseReturn>[1]
>

/**
* Transition invariant is a function that checks whether the context is valid.
* If the context is not valid, it should return an error.
* 
* @typeParam Context - The type of the context.
*
* @param context - The context to check.
* @returns An error if the context is not valid, void otherwise.
*/
export type StateInvariant<Context> = (context: Context) => Error | void
