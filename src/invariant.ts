import { ReactPixiError } from "./ReactPixiError";

type Invariant = (condition: boolean, message?: string) => asserts condition;

const invariant: Invariant = (condition, message) => {
  if (!condition) {
    throw new ReactPixiError(message);
  }
};

export { invariant };
