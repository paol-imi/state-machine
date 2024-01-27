import { type State } from "./state";
import { type And, type IsAny, type IsNever, type IsSubtypeOf, type Or, type isVoid } from "./types-helpers";

/**
 * Output of a transition function when the transition is not valid, it can either be:
 * - void:  The guard for the transition failed, and the transition should not be
 *          taken.
 * - Error: The transition failed with an error.
 */
export type InvalidTransitionOutput = void | Error;

/**
 * Output of a transition function when the transition is valid, it can either be:
 * - [ToContext]:         The context after the transition.
 * - [ToContext, Return]: The context after the transition and the return value, if any.
 * 
 * @typeParam ToContext - The type of the context after the transition.
 * @typeParam Return    - The type of the return value of the transition function.
 */
export type ValidTransitionOutput<ToContext, Return> =
  IsAny<Return> extends true
  // If The return type has not been specified, allow both the ToContext only 
  // signature with a return value.
  ? [ToContext, Return] | [ToContext]
  : (Or<[IsNever<Return>, isVoid<Return>]> extends true
    // If the return type is void or never, allow only the ToContext only 
    // signature.
    ? [ToContext]
    // If the return type is neither void nor never, allow only the signature
    // with the return value.
    : [ToContext, Return]);

/**
 * Transition function.
 * 
 * @typeParam FromContext - The type of the context before the transition.
 * @typeParam ToContext   - The type of the context after the transition.
 * @typeParam Payload     - The type of the payload for the transition.
 * @typeParam Return      - The type of the return value of the transition function.
 * 
 * @param t - The context before the transition.
 * @param p - The payload for the transition.
 * @returns A transition output.
 */
export type TransitionFunction<FromContext, ToContext, Payload, Return> =
  (t: FromContext, p: Payload) => InvalidTransitionOutput | ValidTransitionOutput<ToContext, Return>

/**
 * Transition guard function, it can return:
 * - boolean: Representing whether the guard for the transition passed or not.
 * - Error:   The guard for the transition failed with an error.
 * - void:    The guard for the transition failed, and the transition should not
 *            be taken (equivalent to false).
 * 
 * @typeParam Context - The type of the context before the transition.
 * @typeParam Payload - The type of the payload for the transition.
 * 
 * @param t - The context before the transition.
 * @param p - The payload for the transition.
 * @returns A boolean or an error.
 */
export type GuardFunction<Context, Payload> =
  (t: Context, p: Payload) => boolean | InvalidTransitionOutput

/**
 * Single transition target, composed of a target state and a transition function.
 * 
 * @typeParam FromContext - The type of the context before the transition.
 * @typeParam ToContext   - The type of the context after the transition.
 * @typeParam Payload     - The type of the payload for the transition.
 * @typeParam Return      - The type of the return value of the transition function.
 */
export type TransitionTarget<FromContext, ToContext, Payload, Return> =
  // Transition defined by a transition function.
  [to: State<ToContext>, f: TransitionFunction<FromContext, ToContext, Payload, Return>]

/**
 * A pure transition (one without a transition function) is possible only if the 
 * ToContext is a subtype of the FromContext and there is no return value.
 * 
 * @typeParam FromContext - The type of the context before the transition.
 * @typeParam ToContext   - The type of the context after the transition.
 * @typeParam Return      - The type of the return value of the transition function.
 */
export type PureTransitionTarget<FromContext, ToContext, Return> =
  // Allow only if the ToContext is a subtype of the FromContext and there is no return value.
  And<[IsSubtypeOf<ToContext, FromContext>, Or<[IsNever<Return>, isVoid<Return>]>]> extends true
  // The pure transition is defined by the target state only.
  ? State<ToContext>
  : never


/**
 * Transition targets, can either be:
 * - SingleTransitionTarget:                     A single transition target.
 * - (SingleTransitionTarget | GuardFunction)[]: Multiple transition targets with
 *                                               guards, the last element must be
 *                                               a single transition target.
 * 
 * @typeParam FromContext - The type of the context before the transition.
 * @typeParam ToContext   - The type of the context after the transition.
 * @typeParam Payload     - The type of the payload for the transition.
 * @typeParam Return      - The type of the return value of the transition function.
 */
export type TransitionTargets<BaseFromContext, BaseToContext, BasePayload, BaseReturn> =
  // A single transition target.
  | TransitionTarget<BaseFromContext, BaseToContext, BasePayload, BaseReturn>
  | PureTransitionTarget<BaseFromContext, BaseToContext, BaseReturn>
  // Multiple transition targets.
  | [...Array<
    // Elements before the last one can be either:
    | TransitionTarget<BaseFromContext, BaseToContext, BasePayload, BaseReturn>
    | GuardFunction<BaseFromContext, BasePayload>>,
    // The last element can be either:
    | TransitionTarget<BaseFromContext, BaseToContext, BasePayload, BaseReturn>
    | PureTransitionTarget<BaseFromContext, BaseToContext, BaseReturn>
    | GuardFunction<BaseFromContext, BasePayload>]

/**
* Transition mutation may mutate the context directly, or create a new one. If 
* there is a change, the new context should be returned, even if the change is
* a mutation.
* 
* @typeParam Context - The type of the context.
* @typeParam Payload - The type of the payload for the transition.
*
* @param context - The context.
* @param payload - The payload for the transition.
* @returns The context after the transition if it has been changed, void otherwise.
*/
export type TransitionAction<Context, Payload> =
  (context: Context, basePayload: Payload) => Context | void
