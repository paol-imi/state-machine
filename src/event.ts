import { type State } from "./state";
import { type TransitionAction, type TransitionTargets } from "./transition";

/**
 * Event associated with State transitions.
 *
 * @typeParam Payload         - The type of the payload for the event, defaults to never.
 * @typeParam Return          - The type of the return value for the event, defaults to never.
 * @typeParam BaseFromContext - The base context type shared by the various states 
 *                              from which the event transitions are possible, 
 *                              defaults to unknown.
 * @typeParam BaseToContext   - The base context type shared by the various states 
 *                              targeted by the event transitions, defaults to unknown.
 */
export type Event<Payload = never, Return = never, BaseFromContext = unknown, BaseToContext = unknown> = {
  /**
   * The name of the event.
   */
  name?: string;
  /**
   * The description of the event.
   */
  description?: string;
  /**
   * Action to be executed when the event is fired.
   */
  fire?: TransitionAction<BaseFromContext, Payload>;
  /**
   * The transitions associated with the event.
   */
  transitions?: EventTransitions<BaseToContext, BaseFromContext, Payload, Return>;
};

/**
 * Event transition, represented as a tuple of the state from which the transition
 * is possible and the transition targets.
 * 
 * @typeParam Payload       - The type of the payload for the event, defaults to never.
 * @typeParam Return        - The type of the return value for the event, defaults to never.
 * @typeParam FromContext   - The type of the context before the transition.
 * @typeParam BaseToContext - The base context type shared by the various states
 *                            targeted by the event transitions, defaults to unknown.
 */
export type EventTransition<Payload = never, Return = never, FromContext = never, BaseToContext = unknown> = [
  /**
   * The state from which the transition is possible.
   */
  from: State<FromContext>,
  /**
   * The transition targets.
   */
  to: TransitionTargets<FromContext, BaseToContext, Payload, Return>,
];

/**
 * Event transitions, represented as a map of transitions from a state to a
 * transition target.
 * 
 * @typeParam Payload         - The type of the payload for the event, defaults to never.
 * @typeParam Return          - The type of the return value for the event, defaults to never.
 * @typeParam BaseFromContext - The base context type shared by the various states
 *                              from which the event transitions are possible,
 *                              defaults to unknown.
 * @typeParam BaseToContext   - The base context type shared by the various states
 *                              targeted by the event transitions, defaults to unknown.
 */
export type EventTransitions<Payload = never, Return = never, BaseFromContext = unknown, BaseToContext = unknown> = ReadonlyMap<
  EventTransition<BaseFromContext, BaseToContext, Payload, Return>[0],
  EventTransition<BaseFromContext, BaseToContext, Payload, Return>[1]
>;