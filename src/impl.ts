import { type State } from "./state";
import { type Event } from "./event";

function transition<FromContext, Payload, Return>(
  state: State<FromContext, any, any, any>,
  context: FromContext,
  event: Event<Payload, Return, any, any>,
  payload: Payload,
) {
  // Search for a possible transition.
  const stateTransitionTargets = state.transitions?.get(event);

  // If no transition is found, return the current state and context.
  if (!stateTransitionTargets) {
    const eventTransitionTargets = event.transitions?.get(state);

    if (!eventTransitionTargets) {
      return;
    }

    return;
  }

  // This is a pure transition, return the target state and the current context.
  if (!Array.isArray(stateTransitionTargets)) {
    return stateTransitionTargets;
  }

  for (const target of stateTransitionTargets) {
    if (typeof target === "function") {
      const result = target(context, payload);

      if (result === false) {
        return;
      }

      if (result instanceof Error) {
        return result;
      }

      if (result === undefined) {
        continue;
      }

      return result;
    }

    if (!Array.isArray(target)) {


      return target;
    }

    const [to, transitionFunction] = target;
  }

}