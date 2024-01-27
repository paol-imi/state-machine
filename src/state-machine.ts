import { type State } from "./state";

/**
 * State machine.
 */
export type StateMachine<BaseContext> = {
  /**
   * The current state of the state machine.
   */
  state: State<BaseContext>;
  /**
   * The current context of the state machine.
   */
  context: BaseContext;
};
