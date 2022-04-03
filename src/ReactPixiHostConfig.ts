import type { DisplayObject as PixiDisplayObject } from "@pixi/display";
import type { HostConfig, OpaqueHandle } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { unstable_now as now } from "scheduler";

import type { PrimitiveProps } from "./components/Primitive";
import { invariant } from "./invariant";
import { ReactPixiInstance } from "./ReactPixiInstance";

const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

const ReactPixiHostConfig: HostConfig<
  /* Type */ string,
  /* Props */ PrimitiveProps<PixiDisplayObject>,
  /* Container */ ReactPixiInstance,
  /* Instance */ ReactPixiInstance,
  /* TextInstance */ never,
  /* SuspenseInstance */ never,
  /* HydratableInstance */ never,
  /* PublicInstance */ PixiDisplayObject | null,
  /* HostContext */ never,
  /* UpdatePayload */ Map<string, unknown>,
  /* ChildSet */ never,
  /* TimeoutHandle */ number,
  /* NoTimeout */ number
> & {
  warnsIfNotActing?: boolean;

  supportsMicrotask?: boolean;
  scheduleMicrotask?: (fn: () => void) => void;

  getCurrentEventPriority?: () => number;

  beforeActiveInstanceBlur?: (internalHandle: OpaqueHandle) => void;
  afterActiveInstanceBlur?: () => void;
  detachDeletedInstance?: () => void;
} = {
  isPrimaryRenderer: false,
  warnsIfNotActing: true,

  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  now,

  scheduleTimeout: (fn, delay) => window.setTimeout(fn, delay),
  cancelTimeout: (id) => window.clearTimeout(id),
  noTimeout: -1,

  supportsMicrotask: true,
  scheduleMicrotask: (fn) => window.queueMicrotask(fn),

  getRootHostContext: () => null,
  getChildHostContext: (parentHostContext) => parentHostContext,

  getCurrentEventPriority: () => DefaultEventPriority,

  // #region Instances
  getPublicInstance: (instance) => instance.instance,

  createInstance: (type, props) => {
    const instance = new ReactPixiInstance(
      props.createInstance,
      props.autoDestroy ?? true,
    );
    for (const [key, value] of Object.entries(props)) {
      instance.setProperty(key, value);
    }
    return instance;
  },

  appendInitialChild: (parentInstance, child) => {
    parentInstance.appendChild(child);
  },

  finalizeInitialChildren: () => false,

  commitMount: noop,

  prepareUpdate: (instance, type, oldProps, newProps) => {
    return instance.diffProperties(oldProps, newProps);
  },

  commitUpdate: (instance, updatePayload) => {
    for (const [key, value] of updatePayload) {
      instance.setProperty(key, value);
    }
  },

  prepareForCommit: () => null,

  resetAfterCommit: noop,

  preparePortalMount: noop,

  hideInstance: (instance) => {
    instance.setProperty("visible", false);
  },

  unhideInstance: (instance) => {
    instance.setProperty("visible", true);
  },

  beforeActiveInstanceBlur: noop,

  afterActiveInstanceBlur: noop,

  detachDeletedInstance: noop,
  // #endregion

  // #region Text Instances
  createTextInstance: () => {
    invariant(false);
  },

  commitTextUpdate: noop,

  shouldSetTextContent: () => false,

  resetTextContent: noop,

  hideTextInstance: noop,

  unhideTextInstance: noop,
  // #endregion

  // #region Child Mutations
  appendChild: (parentInstance, child) => {
    parentInstance.appendChild(child);
  },

  insertBefore: (parentInstance, child, beforeChild) => {
    parentInstance.insertBefore(child, beforeChild);
  },

  removeChild: (parentInstance, child) => {
    parentInstance.removeChild(child);
  },

  appendChildToContainer: (container, child) => {
    container.appendChild(child);
  },

  insertInContainerBefore: (container, child, beforeChild) => {
    container.insertBefore(child, beforeChild);
  },

  removeChildFromContainer: (container, child) => {
    container.removeChild(child);
  },

  clearContainer: (container) => {
    const children = container.children.slice();
    for (const child of children) {
      container.removeChild(child);
    }
  },
  // #endregion
};

export { ReactPixiHostConfig };
