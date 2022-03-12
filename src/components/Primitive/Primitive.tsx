import type { DisplayObject as PixiDisplayObject } from "@pixi/display";
import type { ReactElement, ReactNode, Ref } from "react";

type PrimitiveProps<Instance extends PixiDisplayObject> = {
  createInstance: () => Instance;
  autoDestroy?: boolean;
  children?: ReactNode;
  [key: string]: unknown;
};

type PrimitiveType = <Instance extends PixiDisplayObject>(
  props: PrimitiveProps<Instance> & { ref?: Ref<Instance> },
) => ReactElement;

const Primitive = "Primitive" as unknown as PrimitiveType;

export { Primitive };
export type { PrimitiveProps };
