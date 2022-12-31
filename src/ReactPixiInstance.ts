import type {
  DisplayObject as PixiDisplayObject,
  DisplayObjectEvents as PixiDisplayObjectEvents,
} from "@pixi/display";
import { Container as PixiContainer } from "@pixi/display";

import { invariant } from "./invariant";
import { getProperty } from "./utils/getProperty";
import { hasOwnProperty } from "./utils/hasOwnProperty";
import { isPoint } from "./utils/isPoint";
import { isPointData } from "./utils/isPointData";
import { setProperty } from "./utils/setProperty";

type EventListener = (...args: unknown[]) => void;

class ReactPixiInstance {
  instance: PixiDisplayObject | null = null;
  readonly properties = new Map<string, unknown>();
  private readonly defaultProperties = new Map<string, unknown>();
  private readonly eventListeners = new Map<string, EventListener>();

  parent: ReactPixiInstance | null = null;
  readonly children: ReactPixiInstance[] = [];

  constructor(
    private readonly createInstance: () => PixiDisplayObject,
    private readonly autoDestroy: boolean,
  ) {}

  private create() {
    invariant(this.instance === null);

    this.instance = this.createInstance();

    if (this.properties.size) {
      for (const [key, value] of this.properties) {
        this.setInstanceProperty(key, value);
      }
    }

    if (this.children.length) {
      invariant(this.instance instanceof PixiContainer);
      for (const child of this.children) {
        child.create();
        if (child.instance) {
          this.instance.addChild(child.instance);
        }
      }
    }
  }

  private destroy() {
    invariant(this.instance !== null);

    if (this.children.length) {
      invariant(this.instance instanceof PixiContainer);
      for (const child of this.children) {
        if (child.instance) {
          this.instance.removeChild(child.instance);
        }
        child.destroy();
      }
      this.children.length = 0;
    }

    if (this.properties.size) {
      for (const [key] of this.properties) {
        this.setInstanceProperty(key, undefined);
      }
      this.properties.clear();
    }

    if (this.autoDestroy) {
      this.instance.destroy();
    }

    this.instance = null;
    this.defaultProperties.clear();
    this.eventListeners.clear();
  }

  private isReservedProperty(key: string) {
    switch (key) {
      case "createInstance":
      case "autoDestroy":
      case "children":
        return true;
    }
    return false;
  }

  private isEventProperty(key: string): key is `on${string}` {
    return key.startsWith("on");
  }

  private getEventFromProperty(key: `on${string}`) {
    return key.slice(2).toLowerCase() as keyof PixiDisplayObjectEvents;
  }

  private setInstanceEventListener(
    event: keyof PixiDisplayObjectEvents,
    listener: EventListener | undefined,
  ) {
    const currentListener = this.eventListeners.get(event);
    if (listener === currentListener) return;

    if (currentListener) {
      this.instance!.removeListener(event, currentListener); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }

    if (listener) {
      this.instance!.addListener(event, listener); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      this.eventListeners.set(event, listener);
    } else {
      this.eventListeners.delete(event);
    }
  }

  private setInstanceProperty(key: string, value: unknown) {
    if (this.isEventProperty(key)) {
      const event = this.getEventFromProperty(key);
      if (value) {
        this.setInstanceEventListener(event, value as EventListener);
      } else {
        this.setInstanceEventListener(event, undefined);
      }
    }

    if (value === undefined) {
      if (this.defaultProperties.has(key)) {
        const defaultValue = this.defaultProperties.get(key);
        setProperty(this.instance, key, defaultValue);
      }
      return;
    }

    const currentValue = getProperty(this.instance, key);

    if (!this.defaultProperties.has(key)) {
      let defaultValue = currentValue;
      if (isPoint(defaultValue)) {
        defaultValue = defaultValue.clone();
      }
      this.defaultProperties.set(key, defaultValue);
    }

    if (
      Object.is(value, currentValue) ||
      (isPoint(currentValue) &&
        isPointData(value) &&
        currentValue.equals(value))
    ) {
      return;
    }

    setProperty(this.instance, key, value);
  }

  setProperty(key: string, value: unknown) {
    if (this.isReservedProperty(key)) return;

    if (value !== undefined) {
      this.properties.set(key, value);
    } else {
      this.properties.delete(key);
    }

    if (this.instance) {
      this.setInstanceProperty(key, value);
    }
  }

  diffProperties(
    prevProps: Record<string, unknown>,
    nextProps: Record<string, unknown>,
  ) {
    const updates = new Map<string, unknown>();

    for (const [key, prevValue] of Object.entries(prevProps)) {
      if (this.isReservedProperty(key)) continue;
      if (prevValue === undefined || hasOwnProperty(nextProps, key)) {
        continue;
      }
      updates.set(key, undefined);
    }

    for (const [key, nextValue] of Object.entries(nextProps)) {
      if (this.isReservedProperty(key)) continue;
      const prevValue = prevProps[key];
      if (
        Object.is(prevValue, nextValue) ||
        (isPoint(this.defaultProperties.get(key)) &&
          isPointData(prevValue) &&
          isPointData(nextValue) &&
          prevValue.x === nextValue.x &&
          prevValue.y === nextValue.y)
      ) {
        continue;
      }
      updates.set(key, nextValue);
    }

    return updates.size ? updates : null;
  }

  appendChild(child: ReactPixiInstance) {
    if (child.parent) {
      child.parent.removeChild(child, false);
    }

    child.parent = this;
    this.children.push(child);

    if (this.instance) {
      invariant(this.instance instanceof PixiContainer);
      if (!child.instance) {
        child.create();
      }
      invariant(child.instance !== null);
      this.instance.addChild(child.instance);
    }
  }

  insertBefore(child: ReactPixiInstance, referenceChild: ReactPixiInstance) {
    if (child.parent) {
      child.parent.removeChild(child, false);
    }

    const index = this.children.indexOf(referenceChild);
    invariant(index !== -1);

    child.parent = this;
    this.children.splice(index, 0, child);

    if (this.instance) {
      invariant(this.instance instanceof PixiContainer);
      if (!child.instance) {
        child.create();
      }
      invariant(child.instance !== null);
      this.instance.addChildAt(child.instance, index);
    }
  }

  removeChild(child: ReactPixiInstance, destroy = true) {
    invariant(child.parent === this);

    const index = this.children.indexOf(child);
    invariant(index !== -1);

    child.parent = null;
    this.children.splice(index, 1);

    if (this.instance) {
      invariant(this.instance instanceof PixiContainer);
      invariant(child.instance !== null);
      this.instance.removeChild(child.instance);
      if (destroy) {
        child.destroy();
      }
    }
  }
}

export { ReactPixiInstance };
