declare module "react-reconciler/constants" {
  import type { RootTag } from "react-reconciler";

  export const LegacyRoot: RootTag;
  export const ConcurrentRoot: RootTag;

  export const DefaultEventPriority: number;
  export const DiscreteEventPriority: number;
  export const ContinuousEventPriority: number;
  export const IdleEventPriority: number;
}
