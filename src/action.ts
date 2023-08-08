import {
  Action as ActionSDK,
  ActionTypes as ActionTypesSDK,
} from "deta/dist/types/types/action";
import { ActionTypes, ActionValue, AnyType } from "./types";

export { ActionTypesSDK };

export class Action<
  T extends AnyType,
  A extends ActionTypes<T>,
  V extends ActionValue<T, A>
> extends ActionSDK {
  constructor(public readonly operation: A, public readonly value: V) {
    super(operation, value);
  }
}
