import { ActionsForType, ActionValue, AnyType } from "./types";

export enum ActionTypes {
  Set = "set",
  Trim = "trim",
  Increment = "increment",
  Append = "append",
  Prepend = "prepend",
}

export class Action<
  T extends AnyType,
  A extends ActionsForType<T>,
  V extends ActionValue<T, A>
> {
  constructor(public readonly operation: A, public readonly value: V) {}
}
